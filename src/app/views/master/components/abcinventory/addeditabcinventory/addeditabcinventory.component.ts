import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AbcinventoryService } from '../../../../../services/abcinventory.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { AbcInventory } from '../../../../../interfaces/abcInventory-entiry';

@Component({
  selector: 'app-addeditabcinventory',
  templateUrl: './addeditabcinventory.component.html',
  styleUrl: './addeditabcinventory.component.scss'
})
export class AddeditabcinventoryComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
      public dialogRef: MatDialogRef<AddeditabcinventoryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private abcInventoryService: AbcinventoryService,
        private helper: HelperService
  ){}

  ngOnInit(){
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      AbcInventory_Id:[''],
      ABCInventory_Name:['',Validators.required,NoWhitespaceValidator.cannotContainSpace]
    });

    if(this.data.value){
      this.addEditForm.controls['AbcInventory_Id'].setValue(this.data.value.Id);
      this.addEditForm.controls['ABCInventory_Name'].setValue(this.data.value['ABC Inventory Name'])
    }
  }

  ngOnDestroy(): void {
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    })
  }

    onSave(): void 
    {
      if (this.addEditForm.invalid) 
        {
        this.submittedForm = true; 
        return; 
        } 
        else
        {
        this.submittedForm = false; 
        }
        this.submittedGeneral = true; 
      const ABCInventroryData: AbcInventory = 
      {
        abcInventoryId: this.addEditForm.controls['AbcInventory_Id'].value == "" ? 0 : this.addEditForm.controls['AbcInventory_Id'].value,
        abcInventoryName: this.addEditForm.controls['ABCInventory_Name'].value.trim(),
        tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
      };
      const AbcInventoryInsertService = this.abcInventoryService.insertUpdateAbcInventory(ABCInventroryData).subscribe(
        (response: any) => {
          if (response[0].SuccessMessage) 
          {
            this.toastr.success(response[0].SuccessMessage, 'Success');
            this.dialogRef.close(true);
          }
          else 
          {
            this.toastr.error(response[0].ErrorMessage, 'Error');
          }
        },
        (error:any) => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
      this.subscribedService.push(AbcInventoryInsertService);
    }

    onCancel(): void {
      this.dialogRef.close(''); // Return 'false' to indicate cancellation.
    }

}
