import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActionResponsibleService } from '../../../../production-planning/services/action-responsible.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { ActionResponsibleEntity } from '../../../../../interfaces/action-responsible-interface';

@Component({
  selector: 'app-addeditactionresponsible',
  templateUrl: './addeditactionresponsible.component.html',
  styleUrl: './addeditactionresponsible.component.scss'
})
export class AddeditactionresponsibleComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddeditactionresponsibleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private actionresponsibleService: ActionResponsibleService,
    private helper: HelperService
  ) { }
  ngOnInit() {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      actionResponsible_Id: [''],
      actionResponsible_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
    });

    if (this.data.value) {
      this.addEditForm.controls['actionResponsible_Id'].setValue(this.data.value.Id);
      this.addEditForm.controls['actionResponsible_Name'].setValue(this.data.value['Action Responsible Name'] );
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
    const ABCInventroryData: ActionResponsibleEntity = {
      ActionResponsibleId: this.addEditForm.controls['actionResponsible_Id'].value == "" ? 0 : this.addEditForm.controls['actionResponsible_Id'].value,
      actionResponsibleName: this.addEditForm.controls['actionResponsible_Name'].value.trim(),
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      modifiedBy: 0,
    };
    const AbcInventoryInsertService = this.actionresponsibleService.insertUpdateAction(ABCInventroryData).subscribe(
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
    this.subscribedService.push(AbcInventoryInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }

}
