import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-edit-production-planning-card-view',
  templateUrl: './add-edit-production-planning-card-view.component.html',
  styleUrl: './add-edit-production-planning-card-view.component.scss'
})
export class AddEditProductionPlanningCardViewComponent implements OnInit {

  addEditForm!: FormGroup;
  submittedForm: boolean = false;
  loginInfo: any;
  showColumns: any[]=[];
  hideColumns: any[]=[
    {
      ColumnName: "salesId",
      DisplayName: "Sales ID",
      Order: 1
    },
    {
      ColumnName: "prodId",
      DisplayName: "Prod ID",
      Order: 10
    },
    {
      ColumnName: "site",
      DisplayName: "site",
      Order: 2
    },
    {
      ColumnName: "customerName",
      DisplayName: "Customer Name",
      Order: 4
    },
    {
      ColumnName: "businessUnit",
      DisplayName: "Business Unit",
      Order: 5
    },
    {
      ColumnName: "prodStatus",
      DisplayName: "AX Prod Status",
      Order: 6
    },
    {
      ColumnName: "configuration",
      DisplayName: "Configuration",
      Order: 7
    },
    {
      ColumnName: "vinNumber",
      DisplayName: "Chassis VIN",
      Order: 8
    },
    {
      ColumnName: "prodDeliveryDate",
      DisplayName: "Prod Delivery Date",
      Order: 9
    },
    {
      ColumnName: "requestedShipDate",
      DisplayName: "Requested Ship Date",
      Order: 10
    },
    {
      ColumnName: "requestedReceiptDate",
      DisplayName: "Requested Receipt Date",
      Order: 11
    },
    {
      ColumnName: "salesStatus",
      DisplayName: "Sales Status",
      Order: 12
    },
    {
      ColumnName: "soCreatedDate",
      DisplayName: "SO Creation Date and Time",
      Order: 13
    },
    {
      ColumnName: "salesResponsible",
      DisplayName: "Sales Responsible",
      Order: 14
    },
    {
      ColumnName: "make",
      DisplayName: "Chassis Make",
      Order: 15
    },
    {
      ColumnName: "model",
      DisplayName: "Chassis Model",
      Order: 16
    },
    {
      ColumnName: "modelYear",
      DisplayName: "Model Year",
      Order: 17
    },
    {
      ColumnName: "lastOperation",
      DisplayName: "Last Completed Operation",
      Order: 18
    },
    {
      ColumnName: "chassisCA",
      DisplayName: "Chassis CA",
      Order: 18
    },
    {
      ColumnName: "Production Pool",
      DisplayName: "Production Pool",
      Order: 19
    }
  ];
  active: number = 1;

  constructor(
    public dialogRef: MatDialogRef<AddEditProductionPlanningCardViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private helper: HelperService
  ) { }

  ngOnInit(): void {
     this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
     this.addEditForm = this.fb.group({
       tabName: ['', Validators.required],
       tabOrder: ['', Validators.required],
     });

     if (this.data.value) {
       this.addEditForm.controls['tabName'].setValue(this.data.value['Tab Header']);
       this.addEditForm.controls['tabOrder'].setValue(this.data.value['Tab Order']);
     }
  }

  onSave(): void {

    if (this.addEditForm.invalid) {
      this.submittedForm = true; // Mark the form as submitted.
      this.addEditForm.markAllAsTouched();
      return; // Stop execution if the form is invalid.
    } else {
      this.submittedForm = false; // Reset the form submission status.
    }

    // this.dialogRef.close(this.addEditForm.value);

  }

  onCancel(): void {
    this.dialogRef.close(false); // Return 'false' to indicate cancellation.
  }

  selectAll(section: string, event: Event) {
    if (section === 'show') {
      this.showColumns.forEach(
        (item) => (item.checked = (event.target as HTMLInputElement).checked)
      );
    } else if (section === 'hide') {
      this.hideColumns.forEach(
        (item) => (item.checked = (event.target as HTMLInputElement).checked)
      );
    }
  }

  setCheckInput(item: any) {
    return item.checked;
  }

  onMoveRight(n) {
    // Check if at least one item is selected in showColumns
    const selectedItems = this.showColumns.filter((opt) => opt.checked);
    if (selectedItems.length === 0) {
      // Display warning message
      this.toastr.warning('Select atleast 1 item to move', 'WARNING');
      return;
    } else if (selectedItems.length == this.showColumns.length) {
      this.toastr.warning(
        "All the columns can't be moved, please unselect any 1 column!",
        'WARNING'
      );
      return;
    }

    // Move selected items to hideColumns
    this.hideColumns.push(...selectedItems);

    // Remove selected items from showColumns
    this.showColumns = this.showColumns.filter((el) => !el.checked);

    // Reset checked status and set active index
    this.hideColumns.forEach((el, index) => {
      el.checked = false;
      if (!el.checked) {
        this.active = n;
      }
    });
  }

  onMoveLeft(n) {
    let leftData = this.hideColumns
      .filter((opt) => opt.checked)
      .map((opt) => opt);
    this.showColumns.push(...leftData);
    this.hideColumns = this.hideColumns.filter((el) => el.checked != true);
    this.showColumns.forEach((el, index) => {
      if (el.checked == true) {
        this.active = n;
      }
      el.checked = false;
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.showColumns, event.previousIndex, event.currentIndex);
    console.log(this.showColumns);
  }

}
