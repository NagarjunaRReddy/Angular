import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddEditProductionPlanningCardViewComponent } from './add-edit-production-planning-card-view/add-edit-production-planning-card-view.component';

@Component({
  selector: 'app-production-planning-card-view',
  templateUrl: './production-planning-card-view.component.html',
  styleUrl: './production-planning-card-view.component.scss',
})
export class ProductionPlanningCardViewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  loadTable: boolean = false;
  settings = {
    TableSettingsId: 3,
    RoleId: 6,
    IsScrollable: false,
    IsPagination: true,
    IsSorting: true,
    IsFilter: true,
    IsMultiselect: false,
    Pagination: true,
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };

  themeSettings = {
    RoleId: 6,
    ColourMode: 'light',
    ColourThemeSettingId: 1,
    PrimaryBackgroundColour: '#141bdb',
    SecondaryBackgroundColour: '#802836',
    PrimaryTextColour: '#000000',
    OnHoverColour: '#000000',
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };

  columnNames: string[] = ['Sl.No.', 'Tab Header', 'Tab Order', 'Action'];
  subscribedService: Subscription[] = [];
  allCardList: any[] = [
    { slNo: 1, 'Tab Header': 'Sales Order', "Tab Order": 1 },
    { slNo: 2, 'Tab Header': 'Supply Chain', "Tab Order": 2 },
    { slNo: 3, 'Tab Header': 'Production', "Tab Order": 3 },
    { slNo: 4, 'Tab Header': 'Spec Review', "Tab Order": 4 },
    { slNo: 5, 'Tab Header': 'BOM', "Tab Order": 5 },
    { slNo: 6, 'Tab Header': 'Change Order', "Tab Order": 6 },
    { slNo: 7, 'Tab Header': 'Documents', "Tab Order": 7 },
    { slNo: 8, 'Tab Header': 'Drawings', "Tab Order": 8 },
  ];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;

  searchTab: string = '';

  constructor(
    private helperService: HelperService,
    private dialog: MatDialog,
    private toster: ToastrService
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    console.log(table);

    this.settings = JSON.parse(table);
    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);
    this.loadTable = true;
    this.getColumns();
    this.dataSource.data = this.allCardList;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getColumns(): void {}

  deleteItem(element: any, event:any , index:number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.allCardList.forEach((item: any, i: number) => {
          if (i === index) {
            this.allCardList.splice(i, 1); // Remove the item at the specified index
          }
        });
        this.dataSource.data = this.allCardList;
        this.dataSource.filter = "";
      }
    });
  }

  applyFilter(event: Event | string) {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editCardView(element: any, event: Event, index:number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(
      AddEditProductionPlanningCardViewComponent,
      {
        width: '50%', // Adjust the width as needed
        data: {
          title: 'Update Card View',
          button: 'Update',
          view: false,
          value: element,
        },
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.allCardList.forEach((item:any, i:number) => {
          if( i == index){
            this.allCardList[i] = { 
              ...this.allCardList[i],
              "Tab Header": result.tabName,
              "Tab Order": result.tabOrder
            };
          }
        });
        this.dataSource.data = this.allCardList;
        this.dataSource.filter = "";
      }
    });
  }

  addCardView(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(
      AddEditProductionPlanningCardViewComponent,
      {
        width: '35%', // Adjust the width as needed
        data: {
          title: 'Add Card View',
          button: 'Save',
          view: false,
        },
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.allCardList.push({
          slNo:this.dataSource.data.length + 1,
          "Tab Header": result.tabName,
          "Tab Order": result.tabOrder,
        });
        this.dataSource.data = this.allCardList;
        this.dataSource.filter = "";
      }
    });
  }

  viewItem(element: any, event: Event, index:number) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(
      AddEditProductionPlanningCardViewComponent,
      {
        width: '50%', // Adjust the width as needed
        data: {
          title: 'Card View',
          button: 'View',
          view: true,
          value: element,
        },
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        
      }
    });
  }

}
