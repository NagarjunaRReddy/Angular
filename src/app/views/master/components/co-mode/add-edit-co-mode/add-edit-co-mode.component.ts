import { Component, Inject, OnInit } from '@angular/core';
import { AddeditdrawingstatusComponent } from '../../drawingstatus/addeditdrawingstatus/addeditdrawingstatus.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from '../../../../../services/helper.service';
import { CoModeService } from '../../../../production-planning/services/co-mode.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';

@Component({
  selector: 'app-add-edit-co-mode',
  templateUrl: './add-edit-co-mode.component.html',
  styleUrl: './add-edit-co-mode.component.scss'
})
export class AddEditCoModeComponent  implements OnInit{

   addEditForm!: FormGroup;
    submittedForm: boolean = false;
    submittedGeneral: boolean = false;
    loginInfo: any;
    subscribedService: Subscription[] = [];
    button:string;
  
  
    constructor(
      private dialogRef:MatDialogRef<AddeditdrawingstatusComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any,
      private fb:FormBuilder,
      private helper:HelperService,
      private comodstatus:CoModeService,
      private toastr:ToastrService
    ) 
    {}
  ngOnInit(): void {
    console.log(this.data);//this the data
    
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
        this.addEditForm = this.fb.group
        ({
          coModeStatusId:[0],// we need for edit
          coModeStatusName:['', Validators.required, NoWhitespaceValidator.cannotContainSpace],//We need for edit purpos.
          colorcode: ['#000000']//we need set for this one to edit .
        });
        if(this.data.value){
          this.addEditForm.controls['coModeStatusId'].setValue(this.data.value.Id);
          this.addEditForm.controls['coModeStatusName'].setValue(this.data.value['CO Mode Status Name']);//(naming converstions here and database same )
          this.addEditForm.controls['colorcode'].setValue(this.data.value['Color Code']);
        }
      }
  

 onSave() 
  {
    if(this.addEditForm.invalid){
      this.addEditForm.markAllAsTouched();
      return;
    }
   

    let data = {
      // drawingStatusId: this.addEditForm.value.DrawingStatusId,//Edit purpose we send id.
      // drawingStatus: this.addEditForm.value.DrawingStatus.trim(),
      // color: this.addEditForm.value.Color,
      // tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      // createdBy: this.loginInfo.TenantId ? this.loginInfo.createdBy : 0

      coModeStatusId: this.addEditForm.value.coModeStatusId,//Edit purpose we send id.
      coModeStatusName:this.addEditForm.value.coModeStatusName.trim(),
      colorcode: this.addEditForm.value.colorcode,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.createdBy : 0

    }

    this.comodstatus.insertUpdateCOMode(data).subscribe((res:any)=>{
      console.log(res);
      if(res[0].SuccessMessage){
        this.toastr.success(res[0].SuccessMessage, "SUCCESS");
        this.dialogRef.close(true);
      }
      if(res[0].ErrorMessage){
        this.toastr.error(res[0].ErrorMessage, "ERROR");
        // this.dialogRef.close(true);
      }
    })

  }
  onCancel() 
  {
    this.dialogRef.close();
  }


}
