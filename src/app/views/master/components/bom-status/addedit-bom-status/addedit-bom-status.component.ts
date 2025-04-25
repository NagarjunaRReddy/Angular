import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { BomService } from '../../../../production-planning/services/bom.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { BOMStatusEntity } from '../../../../production-planning/interfaces/bom-interface';

@Component({
  selector: 'app-addedit-bom-status',
  templateUrl: './addedit-bom-status.component.html',
  styleUrl: './addedit-bom-status.component.scss'
})
export class AddeditBomStatusComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  
   constructor(
      public dialogRef: MatDialogRef<AddeditBomStatusComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private fb: FormBuilder,
      private toastr: ToastrService,
      private bomService: BomService,
      private helper: HelperService
    ) { }

ngOnInit(): void {
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
     this.addEditForm = this.fb.group({
       Id: [''],
       BOMStatus_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
       Color_Code:['#000000',Validators.required, NoWhitespaceValidator.cannotContainSpace]
     });

     if (this.data.value) {
       this.addEditForm.controls['Id'].setValue(this.data.value.Id);
       this.addEditForm.controls['BOMStatus_Name'].setValue(this.data.value['BOM Status']);
       this.addEditForm.controls['Color_Code'].setValue(this.data.value['Color Code']);

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

    const bomData: BOMStatusEntity = {
      BOMStatusId: this.addEditForm.controls['Id'].value == "" ? 0 : this.addEditForm.controls['Id'].value,
      BOMStatusName: this.addEditForm.controls['BOMStatus_Name'].value.trim(),
      ColorCode:this.addEditForm.controls['Color_Code'].value,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const bomstatusInsertService = this.bomService.insertUpdateBom(bomData).subscribe(
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
    this.subscribedService.push(bomstatusInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

}
