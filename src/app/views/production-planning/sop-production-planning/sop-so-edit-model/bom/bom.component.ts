import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent implements OnInit {

  // MatTableDataSource to manage the table data
  dataSource = new MatTableDataSource<any>();

  // Displayed columns in the table
  displayedColumns: any[] = [
    'bomStatusName',
    'bomDate',
  ];

  // Column definitions with headers
  columns: any[] = [
    { columnDef: 'bomStatusName', header: 'BOM Status', id: 1 },
    { columnDef: 'bomDate', header: 'BOM Date', id: 2 },
  ];

  // Sample data for the table
  data: any[] = [
    {
      bomStatus: 'None',
      bomDate: '23-May-2023',
    }
  ];

  // Input properties to receive data from parent component
  @Input() bomData: any;
  @Input() commonTableData: any;

  constructor(private datePipe: DatePipe) {}

  // Lifecycle hook after the view has been initialized
  ngAfterViewInit() {
    // Initialize MatTableDataSource with bomData
    this.dataSource = new MatTableDataSource(this.bomData);
  }

  // Lifecycle hook when the component is initialized
  ngOnInit(): void {}

  // Function to format the date using DatePipe
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
  

}
