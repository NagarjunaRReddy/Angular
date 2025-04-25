import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SalesstatusmasterComponent } from '../salesstatusmaster.component';
import { SalesStatusService } from '../../../../production-planning/services/sales-status.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { salesStatusEntities } from '../../../../../interfaces/salesStatusEntity';

@Component({
  selector: 'app-addeditsalesstatusmaster',
  templateUrl: './addeditsalesstatusmaster.component.html',
  styleUrl: './addeditsalesstatusmaster.component.scss'
})
export class AddeditsalesstatusmasterComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddeditsalesstatusmasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SalesStatusService: SalesStatusService,
    private helper: HelperService
  ) { }

  ngOnInit() {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      salesStatus_Id: [''],
      sales_Status: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
      Color_Code: ['#000000', Validators.required, NoWhitespaceValidator.cannotContainSpace]
    });
    if (this.data.value) {
      this.addEditForm.controls['salesStatus_Id'].setValue(this.data.value.salesStatusId );
      this.addEditForm.controls['sales_Status'].setValue(this.data.value['Sales Status']);
      this.addEditForm.controls['Color_Code'].setValue(this.data.value['Sales Color']);
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

    const bomData: salesStatusEntities = {
      salesStatusId: this.addEditForm.controls['salesStatus_Id'].value == "" ? 0 : this.addEditForm.controls['salesStatus_Id'].value,
      salesStatus: this.addEditForm.controls['sales_Status'].value.trim(),
      color:this.addEditForm.controls['Color_Code'].value,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const bomstatusInsertService = this.SalesStatusService.insertUpdateSalesStatus(bomData).subscribe(
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
