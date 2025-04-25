// Importing necessary Angular modules and components
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ax-so-details-model',
  templateUrl: './ax-so-details-model.component.html',
  styleUrls: ['./ax-so-details-model.component.scss']
})
export class AxSoDetailsModelComponent implements OnInit {

  // Constructor with MatDialogRef and MAT_DIALOG_DATA injection
  constructor(public dialogRef: MatDialogRef<AxSoDetailsModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {}

  // OnInit lifecycle hook
  ngOnInit(): void {
      // Logging the received data for debugging purposes
      console.log(this.data);
  }

  // Function to handle cancellation and close the dialog
  onCancel() {
    this.dialogRef.close();
  }

  // Function to set slot color based on inventory status
  setSlotColor(status: any) {
    switch (status) {
      case 'Red':
        return 'red-bg'; // Set red background
      case null:
        return 'blue-bg'; // Set blue background for null status
      case 'Green':
        return 'green-bg'; // Set green background
      case 'Goldenrod':
        return 'yellow-bg'; // Set yellow background
      default:
        return 'default-bg'; // Set default background for other cases
    }
  }

}
