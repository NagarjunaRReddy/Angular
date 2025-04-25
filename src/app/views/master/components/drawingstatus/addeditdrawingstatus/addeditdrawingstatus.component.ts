import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { DrawingStatusService } from '../../../../production-planning/services/drawing-status.service';
import { ToastrService } from 'ngx-toastr';
import { NoWhitespaceValidator } from '../../../../../shared/utlis/no-whitespace-validator';

@Component({
  selector: 'app-addeditdrawingstatus',
  templateUrl: './addeditdrawingstatus.component.html',
  styleUrl: './addeditdrawingstatus.component.scss'
})
export class AddeditdrawingstatusComponent implements OnInit {
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
    private drawingService:DrawingStatusService,
    private toastr:ToastrService
  ) 
  {}

  ngOnInit(): void 
  {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.addEditForm = this.fb.group({
      DrawingStatusId:[0],// we need for edit
      DrawingStatus:['', Validators.required, NoWhitespaceValidator.cannotContainSpace],//We need for edit purpos.
      Color: ['#000000']//we need set for this one to edit .
    });
    if(this.data.value){
      this.addEditForm.controls['DrawingStatusId'].setValue(this.data.value.Id);
      this.addEditForm.controls['DrawingStatus'].setValue(this.data.value['Drawing Status']);
      this.addEditForm.controls['Color'].setValue(this.data.value['Drawing Status Color']);
    }
  }

  

  onSave() 
  {
    if(this.addEditForm.invalid)
    {
      this.addEditForm.markAllAsTouched();
      return;
    }
    let data =
     {
      drawingStatusId: this.addEditForm.value.DrawingStatusId,//Edit purpose we send id.
      drawingStatus: this.addEditForm.value.DrawingStatus.trim(),
      color: this.addEditForm.value.Color,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.CreatedBy : 0
      }

    this.drawingService.insertUpdateDrawingStatus(data).subscribe((res:any)=>{
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
