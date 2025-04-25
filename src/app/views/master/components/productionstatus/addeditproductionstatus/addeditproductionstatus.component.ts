import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { ProductionStatusService } from '../../../../production-planning/services/production-status.service';
import { BaseService } from '../../../../../base/base.service';
import { MasterDetailsEntity } from '../../../../../interfaces/master-details-entity';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';
import { ProductionStatusEntitties } from '../../../../../interfaces/productionstatus';

@Component({
  selector: 'app-addeditproductionstatus',
  templateUrl: './addeditproductionstatus.component.html',
  styleUrl: './addeditproductionstatus.component.scss'
})
export class AddeditproductionstatusComponent {
addEditForm!: FormGroup;
  submittedForm: boolean = false;
  submittedGeneral: boolean = false;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  selectedFile: File | null = null;
  attachmentFiles: any[]=[];
  imageURL: any;
  iconUrl: any;
  iconName: any;
  menuData: any;
  formBuilder: any;

  constructor(
       public dialogRef: MatDialogRef<AddeditproductionstatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private productionstatusService: ProductionStatusService,
        private helper: HelperService,
        private baseService:BaseService,
  ){}
  ngOnInit(): void {
       this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
       this.addEditForm = this.fb.group({
        ProdStatus_Id: [''],
        AxProdStatus_Name: ['', Validators.required, NoWhitespaceValidator.cannotContainSpace],
       });
  
       if (this.data.value) {
         this.addEditForm.controls['ProdStatus_Id'].setValue(this.data.value.Id);
         this.addEditForm.controls['AxProdStatus_Name'].setValue(this.data.value['Production Status Name'].trim() );
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
  
      const ProductionStatusData: ProductionStatusEntitties = {
        Id: this.addEditForm.controls['ProdStatus_Id'].value == "" ? 0 : this.addEditForm.controls['ProdStatus_Id'].value,
        ProductionStatusName: this.addEditForm.controls['AxProdStatus_Name'].value.trim(),
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
      };
      const ProductionInsertService = this.productionstatusService.ProductionStatusInsertUpdate(ProductionStatusData).subscribe(
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
      this.subscribedService.push(ProductionInsertService);
    }
  
    onCancel(): void {
      this.dialogRef.close(''); // Return 'false' to indicate cancellation.
    }

  
}
