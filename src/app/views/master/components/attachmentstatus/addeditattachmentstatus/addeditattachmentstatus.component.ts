import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AttachmentStatusService } from '../../../../production-planning/services/attachment-status.service';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { AttachmentStatusEntiti } from '../../../../../interfaces/Attachment-Status-Entity';

@Component({
  selector: 'app-addeditattachmentstatus',
  templateUrl: './addeditattachmentstatus.component.html',
  styleUrl: './addeditattachmentstatus.component.scss'
})
export class AddeditattachmentstatusComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddeditattachmentstatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private attachmentStatusService: AttachmentStatusService,
    private helper: HelperService
  ) { }

  ngOnInit() {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      Attachment_Id: [''],
      Attachment_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
      Attach_Color:['#000000',Validators.required,NoWhitespaceValidator.cannotContainSpace]
    });

    if (this.data.value) {
      this.addEditForm.controls['Attachment_Id'].setValue(this.data.value.attachmentStatusId );
      this.addEditForm.controls['Attachment_Name'].setValue(this.data.value['Attachment Status'])
      this.addEditForm.controls['Attach_Color'].setValue(this.data.value['Attachment Color'] )

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

    const attachmentData: AttachmentStatusEntiti = {
      attachmentStatusId: this.addEditForm.controls['Attachment_Id'].value == "" ? 0 : this.addEditForm.controls['Attachment_Id'].value,
      attachmentStatus: this.addEditForm.controls['Attachment_Name'].value.trim(),
      color:this.addEditForm.controls['Attach_Color'].value,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const AttachmentInsertService = this.attachmentStatusService.insertUpdateAttachmentStatus(attachmentData).subscribe(
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
    this.subscribedService.push(AttachmentInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
}
