import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActionStatusService } from '../../../../production-planning/services/action-status.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { ActionStatusEntity } from '../../../../../interfaces/action-status-interface';

@Component({
  selector: 'app-addeditactionstatus',
  templateUrl: './addeditactionstatus.component.html',
  styleUrl: './addeditactionstatus.component.scss'
})
export class AddeditactionstatusComponent {
 addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

   constructor(
        public dialogRef: MatDialogRef<AddeditactionstatusComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any,
          private fb: FormBuilder,
          private toastr: ToastrService,
          private actionstatusService: ActionStatusService,
          private helper: HelperService
    ){}

    ngOnInit(){
        this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
        this.addEditForm = this.fb.group({
          ActionStatus_Id:[''],
          ActionStatus_Name:['',Validators.required,NoWhitespaceValidator.cannotContainSpace],
          color_Code:['#000000',Validators.required,NoWhitespaceValidator.cannotContainSpace]
        });
    
        if(this.data.value){
          this.addEditForm.controls['ActionStatus_Id'].setValue(this.data.value.Id);
          this.addEditForm.controls['ActionStatus_Name'].setValue(this.data.value['Action Status Name'].trim());
          this.addEditForm.controls['color_Code'].setValue(this.data.value['Color Code']);
        }
      }
    
      ngOnDestroy(): void {
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
          const ABCInventroryData: ActionStatusEntity = {
            ActionStatusId: this.addEditForm.controls['ActionStatus_Id'].value == "" ? 0 : this.addEditForm.controls['ActionStatus_Id'].value,
            ActionStatusName: this.addEditForm.controls['ActionStatus_Name'].value.trim(), 
            colorCode: this.addEditForm.controls['color_Code'].value,
            TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
            CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
            ModifiedBy:0,
          };
          const AbcInventoryInsertService = this.actionstatusService.insertUpdateAction(ABCInventroryData).subscribe(
            (response: any) => {
              if (response[0].SuccessMessage) {
                this.toastr.success(response[0].SuccessMessage, 'Success');
                this.dialogRef.close(true);
              }
              else {
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
