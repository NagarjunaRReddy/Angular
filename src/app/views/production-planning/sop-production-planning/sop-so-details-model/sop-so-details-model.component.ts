import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sop-so-details-model',
  templateUrl: './sop-so-details-model.component.html',
  styleUrls: ['./sop-so-details-model.component.scss']
})
export class SopSoDetailsModelComponent implements OnInit {

  // Constructor to initialize the MatDialogRef and MAT_DIALOG_DATA
  constructor(public dialogRef: MatDialogRef<SopSoDetailsModelComponent>, private datePipe:DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,) {}

  // Lifecycle hook called when the component is initialized
  ngOnInit(): void {
    // Log the received data to the console
    console.log(this.data);
  }

  // Method to handle the cancel action and close the dialog
  onCancel() {
    this.dialogRef.close();
  }

  // Method to set the slot color based on the provided status
  setSlotColor(status: any) {
    switch (status) {
      case 'Red':
        return 'red-bg';
      case null:
        return 'blue-bg';
      case 'Green':
        return 'green-bg';
      case 'Goldenrod':
        return 'yellow-bg';
      default:
        return 'default-bg';
    }
  }

  checkCategorizedData() {
    const { category, subCategory, deliveryDate, customerName, dealerName } = this.data.tableData;
    return !!(category || subCategory || deliveryDate || customerName || dealerName);
  }
  

  ConvertDate(date: any): string {
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ''; // Return empty string if the date is invalid
      }
  
      const cdate = this.datePipe.transform(parsedDate, 'MM/dd/yy');
      if (cdate === '01/01/00' || cdate === '01/01/01' || cdate === null) {
        return '';
      } else {
        return cdate;
      }
    } else {
      return '';
    }
  }
  

}
