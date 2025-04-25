import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SalesResposibleService } from '../../../../../services/sales-resposible.service';
import { HelperService } from '../../../../../services/helper.service';
import { BaseService } from '../../../../../base/base.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { SalesResposible } from '../../../../../interfaces/sales-resposible';

@Component({
  selector: 'app-addeditsalesresposible',
  templateUrl: './addeditsalesresposible.component.html',
  styleUrl: './addeditsalesresposible.component.scss'
})
export class AddeditsalesresposibleComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  selectedFile: File | null = null;
  attachmentFiles: any[] = [];
  imageURL: any;
  iconUrl: any;
  iconName: any;
  menuData: any;
  formBuilder: any;

  constructor(
    public dialogRef: MatDialogRef<AddeditsalesresposibleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SalesResponsibleService: SalesResposibleService,
    private helper: HelperService,
    private baseService: BaseService,
  ) { }

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      SalesResponsible_Id: [''],
      SalesResponsible_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
    });

    if (this.data.value) {
      this.addEditForm.controls['SalesResponsible_Id'].setValue(this.data.value.Id);
      this.addEditForm.controls['SalesResponsible_Name'].setValue(this.data.value['Sales Resposible']);
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

    const SalesResponsibleStatusData: SalesResposible = {
      salesResposibleId: this.addEditForm.controls['SalesResponsible_Id'].value == "" ? 0 : this.addEditForm.controls['SalesResponsible_Id'].value,
      salesResponsibleName: this.addEditForm.controls['SalesResponsible_Name'].value.trim(),
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      modifiedBy:this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const SalesResponsibleInsertService = this.SalesResponsibleService.SalesResponsibleInsertUpdate(SalesResponsibleStatusData).subscribe(
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
    this.subscribedService.push(SalesResponsibleInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

}
