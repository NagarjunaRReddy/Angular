import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { TruckStatusService } from '../../../../production-planning/services/truck-status.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { TruckStatusEntity } from '../../../../production-planning/interfaces/truck-status.interface';

@Component({
  selector: 'app-add-edit-truckstatus',
  templateUrl: './add-edit-truckstatus.component.html',
  styleUrl: './add-edit-truckstatus.component.scss'
})
export class AddEditTruckstatusComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<AddEditTruckstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private TruckService: TruckStatusService,
    private helper: HelperService) { }


  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      Id: [''],
      TruckStatusName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
    });

    if (this.data.value) {
      this.addEditForm.controls['Id'].setValue(this.data.value.Id);
      this.addEditForm.controls['TruckStatusName'].setValue(this.data.value['Truck Status'].trim());
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    })
  }

  onSave(): void {

    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.

    const TruckStatusData: TruckStatusEntity = {
      TruckStatusId: this.addEditForm.controls['Id'].value == "" ? 0 : this.addEditForm.controls['Id'].value,
      TruckStatusName: this.addEditForm.controls['TruckStatusName'].value.trim(),
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const TruckInsertService = this.TruckService.insertUpdateTruck(TruckStatusData).subscribe(
      (response: any) => {
        if (response[0].SuccessMessage) {
          this.toastr.success(response[0].SuccessMessage, 'Success');
          this.dialogRef.close(true);
        }
        else {
          this.toastr.error(response[0].ErrorMessage, 'Error');
        }
      },
      (error: any) => {
        this.toastr.error("Some Error Occured", "ERROR");
      });
    this.subscribedService.push(TruckInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
}
