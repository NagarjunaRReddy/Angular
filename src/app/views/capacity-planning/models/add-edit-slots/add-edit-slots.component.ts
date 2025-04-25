import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, lastValueFrom } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { SlotService } from '../../services/slot.service';
import { CapacityAreaService } from '../../services/capacity-area.service';
import { CapacityAreaResponse, CapacityAreaSelectEntity } from '../../interfaces/capacity-planning-area';
import { SlotEntity } from '../../interfaces/slots';

@Component({
  selector: 'app-add-edit-slots',
  templateUrl: './add-edit-slots.component.html',
  styleUrl: './add-edit-slots.component.scss'
})
export class AddEditSlotsComponent {
  // Form group for managing form controls
  addEditForm!: FormGroup;
  // Form submission flags
  submittedForm = false;
  submittedGeneral = false;
  // User login information
  loginInfo: any;
  // Array to store service subscriptions for cleanup
  subscribedService: Subscription[] = [];
  // Array to store capacity data
  capacityData: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddEditSlotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService,
    private slotService: SlotService,
    private capacityService: CapacityAreaService
  ) {}

  /**
   * Initializes component and loads required data
   */
  async ngOnInit() {
    try {
      // Get user login information from storage
      this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
      
      // Fetch capacity data
      await this.getCapacityData();

      // Initialize form with validators
      this.addEditForm = this.fb.group({
        production_Id: [''],
        production_Number: ['', [Validators.required, Validators.pattern('[0-9]*')]],
        slot_Descriptions: this.fb.array([])
      });

      // Initialize slot descriptions
      this.initSlotDescriptions();

      // Populate form if editing existing slot
      if (this.data.value) {
        try {
          this.addEditForm.controls['production_Id'].setValue(this.data.value.SlotId);
          this.addEditForm.controls['production_Number'].setValue(
            this.data.value.SlotName.split(' - ')[1]
          );
          this.setSlotDescriptions(JSON.parse(this.data.value?.slotDesc));
        } catch (error) {
          console.error('Error setting form values:', error);
          this.toastr.error('Error loading slot data');
        }
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.toastr.error('Error initializing form');
    }
  }

  /**
   * Getter for slot descriptions form array
   */
  get slotDescriptions(): FormArray {
    return this.addEditForm.get('slot_Descriptions') as FormArray;
  }

  /**
   * Initializes slot description form controls
   */
  initSlotDescriptions(): void {
    try {
      const slotDescriptions = this.slotDescriptions;
      this.capacityData.forEach(() => {
        slotDescriptions.push(this.fb.control(''));
      });
    } catch (error) {
      console.error('Error initializing slot descriptions:', error);
      this.toastr.error('Error setting up form fields');
    }
  }

  /**
   * Sets values for slot descriptions
   * @param slotDesc - Slot description data
   */
  setSlotDescriptions(slotDesc: any): void {
    try {
      const slotDescriptions = this.slotDescriptions;
      slotDescriptions.controls.forEach((control, index) => {
        control.setValue(slotDesc[index]?.Description || '');
      });
    } catch (error) {
      console.error('Error setting slot descriptions:', error);
      this.toastr.error('Error loading slot descriptions');
    }
  }

  /**
   * Fetches capacity data from the server
   */
  async getCapacityData(): Promise<void> {
    try {
      const data: CapacityAreaSelectEntity = {
        CapacityId: 0,
        TenantId: this.loginInfo.TenantId || 0,
      };

      const response = await lastValueFrom(
        this.capacityService.capacityAreaSelect(data)
      ) as CapacityAreaResponse;

      if (response != null) {
        this.capacityData = response.Table1;
      }
    } catch (error) {
      console.error('Error fetching capacity data:', error);
      this.toastr.error('Error loading capacity data');
      throw error; // Propagate error to caller
    }
  }

  /**
   * Handles form submission
   */
  onSave(): void {
    try {
      // Validate form
      if (this.addEditForm.invalid) {
        this.submittedForm = true;
        return;
      }

      this.submittedForm = false;
      this.submittedGeneral = true;

      // Prepare slot data for submission
      const slotData: SlotEntity = {
        slotId: this.addEditForm.controls['production_Id'].value === "" ? 
          0 : this.addEditForm.controls['production_Id'].value,
        slotName: this.addEditForm.controls['production_Number'].value.toString(),
        slotDesc: JSON.stringify(this.capacityData.map((data, index) => ({
          capacityId: data.Id,
          Description: this.slotDescriptions.at(index).value
        }))),
        createdBy: this.loginInfo.TenantId || 0,
        tenantId: this.loginInfo.TenantId || 0
      };

      // Submit data to server
      const slotInsertService = this.slotService.SlotInsertUpdate(slotData)
        .subscribe({
          next: (res: any) => {
            if (res.Table[0].SuccessMessage) {
              this.toastr.success(res.Table[0].SuccessMessage, 'Success');
              this.dialogRef.close(true);
            } else {
              this.toastr.error(res.Table[0].ErrorMessage, 'Error');
            }
          },
          error: (error: any) => {
            console.error('Error saving slot:', error);
            this.toastr.error("Error saving slot data", "ERROR");
          }
        });

      this.subscribedService.push(slotInsertService);
    } catch (error) {
      console.error('Error in onSave:', error);
      this.toastr.error('Error saving slot');
    }
  }

  /**
   * Handles dialog cancellation
   */
  onCancel(): void {
    try {
      this.dialogRef.close('');
    } catch (error) {
      console.error('Error closing dialog:', error);
    }
  }

  /**
   * Cleanup on component destruction
   */
  ngOnDestroy(): void {
    try {
      this.subscribedService.forEach(element => {
        element.unsubscribe();
      });
    } catch (error) {
      console.error('Error in cleanup:', error);
    }
  }
}
