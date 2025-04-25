import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { PrdStageService } from '../../../../production-planning/services/prd-stage.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { PRDStageEntity } from '../../../../../interfaces/prd-stage-interface';

@Component({
  selector: 'app-add-edit-prd-stage',
  templateUrl: './add-edit-prd-stage.component.html',
  styleUrl: './add-edit-prd-stage.component.scss'
})
export class AddEditPrdStageComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
     public dialogRef: MatDialogRef<AddEditPrdStageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private prdstageService: PrdStageService,
        private helper: HelperService
  ){}

  ngOnInit(): void {
    console.log(this.data);
    
       this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
       this.addEditForm = this.fb.group({
         Id: [''],
         PRDStageName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
         PRDColor: ['#000000',Validators.required,NoWhitespaceValidator.cannotContainSpace],
       });
  
       if (this.data.value) {
         this.addEditForm.controls['Id'].setValue(this.data.value.Id);
         this.addEditForm.controls['PRDStageName'].setValue(this.data.value['Production Stage Name'].trim());
         this.addEditForm.controls['PRDColor'].setValue(this.data.value['PRDColor']);
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
    
        const prdstageData: PRDStageEntity = {
          PRDStageId: this.addEditForm.controls['Id'].value == "" ? 0 : this.addEditForm.controls['Id'].value,
          PRDStageName: this.addEditForm.controls['PRDStageName'].value.trim(),
          PRDColor : this.addEditForm.controls['PRDColor'].value,
          TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
          CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
        };
        const prdstageInsertService = this.prdstageService.insertUpdatePrd(prdstageData).subscribe(
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
        this.subscribedService.push(prdstageInsertService);
      }
    
      onCancel(): void {
        this.dialogRef.close(''); // Return 'false' to indicate cancellation.
      }

}
