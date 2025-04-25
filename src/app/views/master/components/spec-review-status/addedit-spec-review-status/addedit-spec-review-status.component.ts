import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SpecReviewService } from '../../../../production-planning/services/spec-review.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { SpecreviewstatusEntity } from '../../../../production-planning/interfaces/spec-review-interface';

@Component({
  selector: 'app-addedit-spec-review-status',
  templateUrl: './addedit-spec-review-status.component.html',
  styleUrl: './addedit-spec-review-status.component.scss'
})
export class AddeditSpecReviewStatusComponent {
 addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor( public dialogRef: MatDialogRef<AddeditSpecReviewStatusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private specreviewService: SpecReviewService,
      private helper: HelperService){}

  ngOnInit(): void {
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
     this.addEditForm = this.fb.group({
       Id: [''],
       specReviewName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
       Color_Name:['#000000',Validators.required,NoWhitespaceValidator.cannotContainSpace]
     });

     if (this.data.value) {
       this.addEditForm.controls['Id'].setValue(this.data.value.Id);
       this.addEditForm.controls['specReviewName'].setValue(this.data.value['Spec Review Status'].trim());
        this.addEditForm.controls['Color_Name'].setValue(this.data.value['Color Code'])
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
  
      const specreviewData: SpecreviewstatusEntity = {
        SpecreviewstatusId: this.addEditForm.controls['Id'].value == "" ? 0 : this.addEditForm.controls['Id'].value,
        specreviewstatusName: this.addEditForm.controls['specReviewName'].value.trim(),
        ColorCode:this.addEditForm.controls['Color_Name'].value,
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
      };
      const SpecReviewInsertService = this.specreviewService.insertUpdateSpec(specreviewData).subscribe(
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
      this.subscribedService.push(SpecReviewInsertService);
    }
  
    onCancel(): void {
      this.dialogRef.close(''); // Return 'false' to indicate cancellation.
    }


}
