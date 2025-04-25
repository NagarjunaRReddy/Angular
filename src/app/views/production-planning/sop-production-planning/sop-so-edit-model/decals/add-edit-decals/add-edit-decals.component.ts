import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../../../services/helper.service';
import { ActionResponsibleService } from '../../../../services/action-responsible.service';
import { ActionStatusService } from '../../../../services/action-status.service';
import { DecalsService } from '../../../../services/decals.service';


@Component({
  selector: 'app-add-edit-decals',
  templateUrl: './add-edit-decals.component.html',
  styleUrls: ['./add-edit-decals.component.scss']
})
export class AddEditDecalsComponent implements OnInit {

  DecalForm:FormGroup;
  loginInfo: any;
  responsibleList: any[]=[];
  actionStatusList: any[]=[];
  filteredResponsibleData: any[]=[];

  constructor(
    public dialogRef: MatDialogRef<AddEditDecalsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb:FormBuilder,
    private helper:HelperService,
    private toastr:ToastrService,
    private actionService: ActionResponsibleService,
    private actionStatusService: ActionStatusService,
    private decalsService:DecalsService
  ){}

  async ngOnInit() {
    console.log(this.data.item);
    
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
      this.DecalForm = this.fb.group({
        decalStatus:[null],
        decalDate:[null],
        responsible:[null],
      });
      await this.getResponsibleData();
      await this.getActionStatus();
      if(this.data.item){
        this.bindDecalsData(this.data.item);
      }
  }

  bindDecalsData(data:any){
    this.DecalForm.patchValue({
        decalStatus:data.decalStatus,
        decalDate:data.decalsDate,
        responsible:data.resposibleId,
    })
  }

  getResponsibleData() {
    let data = {
      actionResponsibleId: 0,
      tenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.actionService.getAction(data).subscribe((res: any) => {
      console.log(res);
      this.responsibleList = res;
      this.filteredResponsibleData = res;
    });
  }

  getActionStatus() {
    let data = {
      ActionStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.actionStatusService.getAction(data).subscribe((res: any) => {
      console.log(res);
      this.actionStatusList = res;
    });
  }

  filterResponsible(value:any){
    let inputVal = value.toLowerCase();
    this.filteredResponsibleData = this.responsibleList.filter((e:any)=> e.ActionResponsibleName.toLowerCase().includes(inputVal))
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSave(){
    let bodyData = {
      soNumber:this.data.soNumber?this.data.soNumber:"",
      DecalsDate:this.DecalForm.value.decalDate,
      DecalStatus:this.DecalForm.value.decalStatus,
      responsible:this.DecalForm.value.responsible,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      Createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
    }

    const decalInsertUpdate = this.decalsService.insertUpdateDecals(bodyData).subscribe((res:any)=>{
      console.log(res);
      this.toastr.success(res[0].SuccessMessage,"SUCCESS");
      this.dialogRef.close(res)
    },
    (error)=>{
      this.toastr.error(error.message, "ERROR")
      
    }
    )

  }
  

}
