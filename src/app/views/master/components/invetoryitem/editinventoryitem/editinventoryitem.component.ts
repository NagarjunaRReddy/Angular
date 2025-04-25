import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InventoryAbcService } from '../../../../production-planning/services/inventory-abc.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../../services/helper.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editinventoryitem',
  templateUrl: './editinventoryitem.component.html',
  styleUrl: './editinventoryitem.component.scss'
})
export class EditinventoryitemComponent {

  constructor
  ( 
    private dialogRef:MatDialogRef<EditinventoryitemComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private fb:FormBuilder,
    private helper:HelperService,
    private itemmaster:InventoryAbcService,
    private toastr:ToastrService,
  )
  {}

EditForm: FormGroup;

submittedForm: any;
flaglist: any;

onSave() 
{
throw new Error('Method not implemented.');
}
onCancel() 
{
  this.dialogRef.close();
}


}
