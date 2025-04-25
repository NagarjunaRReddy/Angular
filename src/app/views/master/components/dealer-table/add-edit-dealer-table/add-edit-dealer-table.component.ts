import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { DealersEntity } from '../../../../../interfaces/dealer-interface';
import { DealerService } from '../../../../production-planning/services/dealer.service';

@Component({
  selector: 'app-add-edit-dealer-table',
  templateUrl: './add-edit-dealer-table.component.html',
  styleUrl: './add-edit-dealer-table.component.scss'
})
export class AddEditDealerTableComponent {
  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
constructor(private dialogRef:MatDialogRef<AddEditDealerTableComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any,
  private fb: FormBuilder,
  private toastr:ToastrService,
  private helper:HelperService,
  private dealerService:DealerService
){}

 ngOnInit(): void {
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
     this.addEditForm = this.fb.group({
       dealer_Id: [''],
       DealersName: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
     });

     if (this.data.value) {
       this.addEditForm.controls['dealer_Id'].setValue(this.data.value.Id);
       this.addEditForm.controls['DealersName'].setValue(this.data.value['Dealer Name']);
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
        //this.toastr.warning('Page Not Valid');
        return; // Stop execution if the form is invalid.
      } else {
        this.submittedForm = false; // Reset the form submission status.
      }
      this.submittedGeneral = true; // Mark the form as generally submitted.
  
      const dealerData: DealersEntity = {
        DealerId: this.addEditForm.controls['dealer_Id'].value == "" ? 0 : this.addEditForm.controls['dealer_Id'].value,
        DealerName: this.addEditForm.controls['DealersName'].value.trim(),
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
      };
      const siteInsertService = this.dealerService.insertUpdateDealer(dealerData).subscribe(
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
