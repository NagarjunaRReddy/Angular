import { Component, Inject } from '@angular/core';
import { Siteentity } from '../../../../../interfaces/siteentity';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SiteService } from '../../../../../services/site.service';
import { HelperService } from '../../../../../services/helper.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addeditsite',
  templateUrl: './addeditsite.component.html',
  styleUrl: './addeditsite.component.scss'
})
export class AddeditsiteComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddeditsiteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private siteService: SiteService,
    private helper: HelperService
  ) { }

  ngOnInit(): void {
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
     this.addEditForm = this.fb.group({
       site_Id: [''],
       site_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
     });

     if (this.data.value) {
       this.addEditForm.controls['site_Id'].setValue(this.data.value.SiteId);
       this.addEditForm.controls['site_Name'].setValue(this.data.value['Site']);
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

    const siteData: Siteentity = {
      SiteId: this.addEditForm.controls['site_Id'].value == "" ? 0 : this.addEditForm.controls['site_Id'].value,
      SiteName: this.addEditForm.controls['site_Name'].value.trim(),
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const siteInsertService = this.siteService.inserUpdateSite(siteData).subscribe(
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
    this.subscribedService.push(siteInsertService);
  }

  onCancel(): void {
    this.dialogRef.close(''); // Return 'false' to indicate cancellation.
  }
}
