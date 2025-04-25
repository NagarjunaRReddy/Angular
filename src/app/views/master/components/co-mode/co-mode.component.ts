import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { CoModeService } from '../../../production-planning/services/co-mode.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';

import { AddEditCoModeComponent } from './add-edit-co-mode/add-edit-co-mode.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { comodestatusSelectEntity } from '../../../../interfaces/comodestatus';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-co-mode',
  templateUrl: './co-mode.component.html',
  styleUrl: './co-mode.component.scss',
})
export class CoModeComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  comodestatus!: FormGroup;
  displayedColumns: any[] = [];
  loadTable: boolean = false;
  loginInfo: any;
  allSBusinessMaster: any;
  columnNames: any[] = [];
  subscribedService: any[] = [];
  menuData: any;

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
menuAccess: any;
  subMenuAccess: any;

  //Intializing all the services
  constructor(
    private comodeservice: CoModeService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toster: ToastrService,
    private masterdetailsService: MasterdetailsService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.comodestatus = this.fb.group({
      searchTab: [''],
    });
    this.loadTable = true;

    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    ); //this is same for all
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}'); //this is same for all
    this.getColumns();
    this.setMenuAccess();
  }

  setMenuAccess() {
    const routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
  
    if (this.menuAccess.length > 0) {
      const children = this.menuAccess[0].children;
  
      // Filter for the submenu that matches the current page
      this.subMenuAccess = children.filter((child: any) =>
        routerLink.includes(child.MenuPath)
      );
  
      console.log("Filtered SubMenuAccess:", this.subMenuAccess);
    }
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  GetCoMode() {
    const comodestatus: comodestatusSelectEntity = {
      comodestatusId: 0, //JSON.parse(this.helperService.getUserBusinessId()),//this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const businessService = this.comodeservice
      .GetCOMode(comodestatus)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res && res.length && !res[0]?.Message) {
            this.allSBusinessMaster = res;
            // this.columnNames = ['DrawingStatus', 'Color', 'Action'] //here add what columns you want

            // const mappedData = res.map((item: any) => {
            //   const row: any = {};
            //   this.columnNames.forEach((col, index) => {
            //     row[col] = item[col] || ''; // Handle missing values

            //   });
            //   return row;
            // });
            this.dataSource.data = res.map((item: any, idx: any) => {
              return {
                SlNo: idx + 1,
                ...item,
              };
            });

            this.loadTable = true;
            console.log(this.dataSource.paginator, 'paginator');
            this.dataSource.paginator = this.paginator;
          }
        },
        (error) => {
          console.error('Some error occurred', error);
        }
      );
    this.subscribedService.push(businessService);
  }

  //Return the columns dynamically
  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Co Mode',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const comodestatus = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            //this.displayedColumns = res.map((item: any) => item.DisplayName);
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            //this.columnNames = res.map((item: any) => item.ColumnName);
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames.push('Action');
            this.columnNames.unshift('Sl.No.'); //if we want column at beginning.

            // this.columnNames = ['DrawingStatus', 'Color', 'Action'] //here add what columns you want
            console.log(this.columnNames);

            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.GetCoMode();
          }
        },
        (error: any) => {
          //console.error('Error fetching master details:', error);
          this.toster.error(error);
        }
      );
    this.subscribedService.push(comodestatus);
    this.dataSource.paginator = this.paginator;
  }

  addDrgstatus($event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditCoModeComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add CO Mode Status',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetCoMode();
      }
    });
  }

  //filter
  applyFilter(event: Event | string) {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //This is the edit Method
  editItem(row: any, $event: MouseEvent) {
    const dialogRef = this.dialog.open(AddEditCoModeComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update CO Mode Status',
        button: 'Update',
        view: false,
        value: row,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetCoMode();
      }
    });
  }

  //This is the Delete Method
  deleteItem(row: any, $event: MouseEvent) {
    console.log(row);
    let data = {
      comodestatusId: row.Id,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.createdBy : 0,
    };

    //this dialogref is same for all masters
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete this Co Mode status?',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.comodeservice.deleteCOMode(data).subscribe((res: any) => {
          console.log(res);
          if (res[0].SuccessMessage) {
            this.toster.success(res[0].SuccessMessage, 'SUCCESS');
            
            this.GetCoMode();
            window.location.reload();
          }
        });
      }
    });
  }

  // End of the Delete Method
}
