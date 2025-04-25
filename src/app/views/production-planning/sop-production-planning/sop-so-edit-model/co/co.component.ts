// Import necessary Angular modules and components
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

// Component decorator with selector, templateUrl, and styleUrls
@Component({
  selector: 'app-co',
  templateUrl: './co.component.html',
  styleUrls: ['./co.component.scss']
})
export class CoComponent implements OnInit {

  // MatTableDataSource to hold CO data
  dataSource = new MatTableDataSource<any>();

  // Define displayed columns and corresponding headers
  displayedColumns: any[] = [
    'coStatusName',
    'coDate',
  ];

  // Define columns for dynamic usage
  columns: any[] = [
    { columnDef: 'coStatusName', header: 'CO Order Status', id: 1 },
    { columnDef: 'coDate', header: 'CO Order Date', id: 2 },
  ]

  // Sample data for CO
  data: any[] = [
    {
      coStatus: 'None',
      coDate: '23-May-2023',
    }
  ];

  // Input properties for CO data and commonTableData
  @Input() coData: any;
  @Input() commonTableData: any;

  // Constructor with DatePipe injection
  constructor(private datePipe: DatePipe) {}

  // Lifecycle hook called after view initialization
  ngAfterViewInit() {
    // Set the MatTableDataSource with CO data
    this.dataSource = new MatTableDataSource(this.coData);
  }

  // Lifecycle hook called on component initialization
  ngOnInit(): void {}

  // Method to format date using DatePipe
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
