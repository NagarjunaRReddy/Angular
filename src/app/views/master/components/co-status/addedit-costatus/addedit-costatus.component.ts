import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CoStatusService } from '../../../../production-planning/services/co-status.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { COStatusEntity } from '../../../../production-planning/interfaces/co-status-interface';

@Component({
  selector: 'app-addedit-costatus',
  templateUrl: './addedit-costatus.component.html',
  styleUrl: './addedit-costatus.component.scss',
})
export class AddeditCostatusComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddeditCostatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private costatusService: CoStatusService,
    private helper: HelperService
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
    this.addEditForm = this.fb.group({
      Id: [''],
      Co_StatusName: [
        '',
        Validators.required,
        NoWhitespaceValidator.cannotContainSpace,
      ],
      ColorCode: ['#000000'],
      priority: ['', [Validators.required, Validators.min(1)]],
    });

    if (this.data.value) {
      this.addEditForm.controls['Id'].setValue(this.data.value.Id);
      this.addEditForm.controls['Co_StatusName'].setValue(
        this.data.value['CO Status'].trim()
      );
      this.addEditForm.controls['ColorCode'].setValue(
        this.data.value['Color Code']
      );
      this.addEditForm.controls['priority'].setValue(
        this.data.value['Priority']
      );
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  onSave(): void {
    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.

    const bomData: COStatusEntity = {
      CustomerOrderStatusId:
        this.addEditForm.controls['Id'].value == ''
          ? 0
          : this.addEditForm.controls['Id'].value,
      CustomerOrderStatusName:
        this.addEditForm.controls['Co_StatusName'].value.trim(),
      ColorCode: this.addEditForm.controls['ColorCode'].value,
      priority: this.addEditForm.controls['priority'].value,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const coStatusInsertService = this.costatusService
      .insertUpdateCOStatus(bomData)
      .subscribe(
        (response: any) => {
          if (response[0].SuccessMessage) {
            this.toastr.success(response[0].SuccessMessage, 'Success');
            this.dialogRef.close(true);
          } else {
            this.toastr.error(response[0].ErrorMessage, 'Error');
          }
        },
        (error: any) => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(coStatusInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
}
