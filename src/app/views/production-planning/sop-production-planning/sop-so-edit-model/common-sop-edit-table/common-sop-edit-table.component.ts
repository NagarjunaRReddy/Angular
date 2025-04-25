import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-common-sop-edit-table',
  templateUrl: './common-sop-edit-table.component.html',
  styleUrls: ['./common-sop-edit-table.component.scss']
})
export class CommonSopEditTableComponent implements OnInit {

  // MatTableDataSource to hold the data for the table
  dataSource = new MatTableDataSource<any>;

  // Array to define displayed columns in the table
  displayedColumns: any[] = [
    'soNumber',
    'categoryName',
    'subCategoryName',
    'dealerName',
    'customerName',
    // 'site',
    // 'deliveryDate'
  ];

  // Configuration for each column in the table
  columns: any[] = [
    { columnDef: 'soNumber', header: 'Sales Id', id: 1 },
    { columnDef: 'categoryName', header: 'Category', id: 2 },
    { columnDef: 'subCategoryName', header: 'Sub Category', id: 3 },
    { columnDef: 'dealerName', header: 'Dealer', id: 4 },
    { columnDef: 'customerName', header: 'End User', id: 5 },
    // { columnDef: 'site', header: 'Site', id: 6 },
    // { columnDef: 'deliveryDate', header: 'Delivery Date', id: 7 },
  ]

  // Sample data for the table
  data: any[] = [
    {
      so: "SO-006295",
      category: "",
      subCategory: '',
      dealer: '',
      customer: 'CITY OF BASTROP',
      site: 'LaGrange',
      deliveryDate: '23-May-2023'
    }
  ];

  // Input property to receive data from parent component
  @Input() commonTableData:any;

  constructor(private datePipe:DatePipe){}

  // Lifecycle hook called after the view has been initialized
  ngAfterViewInit() {
    // Assign the received data to the MatTableDataSource
    this.dataSource = new MatTableDataSource(this.commonTableData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['commonTableData']) {
      this.ngAfterViewInit();
    }
  }

  // Lifecycle hook called when the component is initialized
  ngOnInit(): void {
    //console.log(this.commonTableData);
    
    // Initialization logic if needed
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
