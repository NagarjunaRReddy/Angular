import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SpecReviewViewComponent } from '../../../../spec-review/spec-review-view/spec-review-view.component';

@Component({
  selector: 'app-sop-spec-review',
  templateUrl: './sop-spec-review.component.html',
  styleUrls: ['./sop-spec-review.component.scss']
})
export class SopSpecReviewComponent implements OnInit {

  // MatTableDataSource for managing table data
  dataSource = new MatTableDataSource<any>();

  // Columns to be displayed in the table
  displayedColumns: any[] = [
    'specStatusName',
    'specDate',
    // 'actions'
  ];

  // Column definitions for the MatTableDataSource
  columns: any[] = [
    { columnDef: 'specStatusName', header: 'Spec Review Status', id: 1 },
    { columnDef: 'specDate', header: 'Spec Review Date', id: 2 },
  ];

  // Sample data for the table
  data: any[] = [
    {
      specReviewStatus: 'None',
      specReviewDate: '23-May-2023',
    }
  ];

  // Input properties to receive data from parent component
  @Input() specData: any;
  @Input() commonTableData: any;

  constructor(private datePipe: DatePipe, private dialog:MatDialog) { }

  // After the view has been initialized, set the data source for the table
  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.specData);
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  // Function to format date using Angular DatePipe
  formatDate(date: any, format: string): string {
    // Use DatePipe to format the date
    return this.datePipe.transform(date, format);
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
  

  editItem(data:any){
    console.log(this.commonTableData);
    let specData = {
        SONumber: this.commonTableData.soNumber,
        SpecReviewDate: data.specDate,
        SpecreviewstatusName: data.specStatusName,
        SpecReviewId: data.specId,
        specreviewcolorcode: data.colorCode,
    }
    const dialogRef = this.dialog.open(SpecReviewViewComponent, {
      width: '80%', // Adjust the width as needed
      data: {
        title: 'Spec Review',
        button: 'Save',
        view: false,
        value: specData,
        action: 'Spec Review'
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          // this.getTableData(this.action);
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  }

}
