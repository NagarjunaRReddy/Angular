import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NoWhitespaceValidator } from '../../../../../../shared/utlis/no-whitespace-validator';
import { RoleEntity } from '../../../../../../interfaces/role-entity';
import { RoleService } from '../../../../../../services/role.service';
import { HelperService } from '../../../../../../services/helper.service';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss']
})
export class AddEditRoleComponent implements OnInit, OnDestroy {

  addEditForm!: FormGroup; // Initialize the form group for adding or editing a role.
  submittedForm: boolean = false; // Flag to track if the form has been submitted.
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(public dialogRef: MatDialogRef<AddEditRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject data passed to the dialog,
    private fb: FormBuilder,
    private roleService: RoleService,
    private toastr: ToastrService,
    private helper: HelperService) { }

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      RoleId: [0], // Initialize RoleId with a default value of 0.
      RoleName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace], // RoleName is required and cannot contain spaces.
      Description: [''] // Description is optional.
    });

    if (this.data.value != undefined) {
      this.addEditForm.controls['RoleId'].setValue(this.data.value.RoleId); // Set RoleId.
      this.addEditForm.controls['RoleName'].setValue(this.data.value.RoleName); // Set RoleName.
      this.addEditForm.controls['Description'].setValue(this.data.value.RoleDescription); // Set Description.
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
      this.submittedForm = true; // Form is submitted and invalid, mark it as submitted.
      return; // Don't proceed with saving the form data.
    } else {
      this.submittedForm = false; // Form is valid.
    }
    let roleData: RoleEntity = {
      RoleId: this.addEditForm.controls['RoleId'].value == "" ? 0 : this.addEditForm.controls['RoleId'].value,
      RoleName: this.addEditForm.controls['RoleName'].value.trim(),
      RoleDescription: this.addEditForm.controls['Description'].value,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const roleInsertService = this.roleService.insertUpdateRole(roleData)
      .subscribe((response: any) => {
        if (response[0].SuccessMessage) {
          this.toastr.success(response[0].SuccessMessage, 'Success');
          this.dialogRef.close(true);
        }
        else {
          this.toastr.error(response[0].ErrorMessage, 'Error');
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
        this.subscribedService.push(roleInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Close the dialog to indicate cancellation.
  }
}
