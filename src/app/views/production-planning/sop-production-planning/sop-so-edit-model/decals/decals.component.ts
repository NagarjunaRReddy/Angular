import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditDecalsComponent } from './add-edit-decals/add-edit-decals.component';

@Component({
  selector: 'app-decals',
  templateUrl: './decals.component.html',
  styleUrls: ['./decals.component.scss']
})
export class DecalsComponent implements OnInit {

  @Input() decalData: any;
  @Input() commonTableData: any;
  @Input() soNumber: any;
  @Input() panView: any;

  // MatTableDataSource to hold CO data
  dataSource = new MatTableDataSource<any>();

  // Define displayed columns and corresponding headers
  displayedColumns: any[] = [
    'ActionStatusName',
    'decalsDate',
    'ActionResponsibleName',
    'actions',
  ];

  data: any[] = [
    {
      decalsStatus: 'None',
      decalsDate: '23-May-2023',
      responsible:''
    }
  ];

  // Define columns for dynamic usage
  columns: any[] = [
    { columnDef: 'ActionStatusName', header: 'Decals Status', id: 1 },
    { columnDef: 'decalsDate', header: 'Decals Date', id: 2 },
    { columnDef: 'ActionResponsibleName', header: 'Responsible', id: 3 },
  ]

  constructor(private datePipe: DatePipe, private dialog:MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['decalData']) {
      this.ngAfterViewInit();
    }
  }

  ngOnInit(): void {
      //console.log(this.decalData , "DECALS Data");
      
  }

  ngAfterViewInit() {
    // Set the MatTableDataSource with CO data
    if(this.decalData.length != 0  ){
      this.dataSource = new MatTableDataSource(this.decalData);
    }else{
      let data = [
        {
          ActionStatusName:null,
          ActionResponsibleName:null,
          decalsDate:null
        }
      ]
      this.dataSource = new MatTableDataSource(data);
    }
  }

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
  

  editItem(data:any){
    const dialogRef = this.dialog.open(AddEditDecalsComponent, {
      minWidth: '30vw', // Adjust the width as needed
      data: {
        title: `Edit Decals`,
        button: "Update",
        item: data,
        soNumber: this.soNumber
      },
      disableClose:true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.dataSource.data = result;
      }
    })
  }

}
