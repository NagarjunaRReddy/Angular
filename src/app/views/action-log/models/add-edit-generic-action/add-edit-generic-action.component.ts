import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-generic-action',
  templateUrl: './add-edit-generic-action.component.html',
  styleUrl: './add-edit-generic-action.component.scss',
})
export class AddEditGenericActionComponent implements OnInit, AfterViewInit {
  minToDate: string | null | any = null;
  actionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private toaster: ToastrService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.actionForm = this.fb.group({
      actions: this.fb.array([]), // Initialize empty FormArray
    });
  }

  ngOnInit(): void {
    console.log(this.data.value);
  }

  ngAfterViewInit(): void {
    console.log(this.data);

    if (this.data.value) {
      let formArray = this.fb.group({
        actionIdentified: [this.data.value.actions],
        responsible: [this.data.value.responsible],
        identifiedDate: [new Date(this.data.value.actionDate)],
        targetDate: [new Date(this.data.value.targetDate)],
        actionStatus: [this.data.value.status],
      });
      this.actions.push(formArray);
    } else {
      for (let i = 1; i <= 3; i++) {
        this.addRow();
      }
    }
  }

  // Get the actions FormArray
  get actions(): FormArray {
    return this.actionForm.get('actions') as FormArray;
  }

  // Create a new row FormGroup
  createRow(): FormGroup {
    return this.fb.group({
      // slNo:[''],
      actionIdentified: [''],
      responsible: [''],
      identifiedDate: [''],
      targetDate: [''],
      actionStatus: [''],
    });
  }

  // Add a new row
  addRow() {
    this.actions.push(this.createRow());
  }

  // Remove a row by index
  removeRow(index: number, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '35%',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
      disableClose: true,
    });

    // Handle the dialog's close event
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (this.actions.length > 1) {
          this.actions.removeAt(index);
        }
      }
    });
  }

  // Submit the form data
  submitForm() {
    console.log(this.actionForm.value);
    this.toaster.success('Added successfully');
  }

  cancelForm() {
    this.actionForm.reset();
    this.dialogRef.close('');
  }
}
