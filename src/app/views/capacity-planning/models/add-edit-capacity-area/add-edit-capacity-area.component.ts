import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../shared/utlis/no-whitespace-validator';
import { CapacityArea } from '../../interfaces/capacity-planning-area';
import { CapacityAreaService } from '../../services/capacity-area.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-edit-capacity-area',
  templateUrl: './add-edit-capacity-area.component.html',
  styleUrl: './add-edit-capacity-area.component.scss'
})
export class AddEditCapacityAreaComponent implements OnInit{
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

constructor( public dialogRef: MatDialogRef<AddEditCapacityAreaComponent>,private fb: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any,
  private helper: HelperService, private toastr : ToastrService,private capacityService: CapacityAreaService
){}

ngOnInit(): void {
  this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo')||'{}');
  this.addEditForm = this.fb.group({
    capacity_Id: [''],
    capacity_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
  });
  
  if (this.data.value) {
    this.addEditForm.controls['capacity_Id'].setValue(this.data.value.Id);
    this.addEditForm.controls['capacity_Name'].setValue(this.data.value.CapacityName);
  }
}
  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
  onSave(): void {
    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }
    this.submittedGeneral = true; // Mark the form as generally submitted.

    const capacityData: CapacityArea = {
      CapacityId: this.addEditForm.controls['capacity_Id'].value == "" ? 0 : this.addEditForm.controls['capacity_Id'].value,
      CapacityName: this.addEditForm.controls['capacity_Name'].value.trim(),
      CreatedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    }
    console.log(capacityData,"capacityData");
    const capacityAreaInsertService = this.capacityService.capacityAreaInsertUpdate(capacityData)
      .subscribe((res: any) => {
        console.log(res,"res");
        
        if (res.Table[0].SuccessMessage) {
          this.toastr.success(res.Table[0].SuccessMessage, 'Success');
        }
        else {
          this.toastr.error(res.Table[0].ErrorMessage, 'Error');
        }
        this.dialogRef.close(true);
      },
        (error:any) => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(capacityAreaInsertService);
  }
}
