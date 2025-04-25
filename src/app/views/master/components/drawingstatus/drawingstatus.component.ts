import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawingStatusService } from '../../../production-planning/services/drawing-status.service';
import { HelperService } from '../../../../services/helper.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AddeditdrawingstatusComponent } from './addeditdrawingstatus/addeditdrawingstatus.component';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { drawingstatusselect } from '../../../../interfaces/drawingstatus';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drawingstatus',
  templateUrl: './drawingstatus.component.html',
  styleUrl: './drawingstatus.component.scss',
})
export class DrawingstatusComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  public dataSource = new MatTableDataSource<any>();

  displayedColumns: any[] = [];
  loadTable: boolean = false;
  loginInfo: any;
  allSBusinessMaster: any;
  columnNames: any[] = [];
  subscribedService: any[] = [];
  menuData: any;
  drngStatus!: FormGroup;

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

  constructor(
    private drawingservice: DrawingStatusService,
    private helperService: HelperService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toster: ToastrService,
    private masterdetailsService: MasterdetailsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.drngStatus = this.fb.group({ searchTab: [''] });
    this.loadTable = true;

    //**This is same for All */
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
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

  GetDrawingStatus() {
    const drawingstatus: drawingstatusselect = {
      drawingstatusId: 0, //JSON.parse(this.helperService.getUserBusinessId()),//this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const businessService = this.drawingservice
      .getDrawingStatus(drawingstatus)
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
            this.dataSource.data = res.map((item: any, idx: number) => {
              return {
                SlNo: idx + 1,
                ...item,
              };
            });
          }
        },
        (error) => {
          console.error('Some error occurred', error);
        }
      );
    this.subscribedService.push(businessService);
  }

  //Here if we send the master name, it  will return columns

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Drawing Status Master',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const drawingStatus = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);

            this.columnNames = res.map((item) => item.ColumnName);
            // this.columnNames = ['SlNo', ...this.columnNames, 'Action'];

            this.columnNames.push('Action');
            this.columnNames.unshift('Sl.No.');

            // this.columnNames = ['DrawingStatus', 'Color', 'Action'] //here add what columns you want

            // Include a Select column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.GetDrawingStatus();
          }
        },
        (error: any) => {
          //console.error('Error fetching master details:', error);
          this.toster.error(error);
        }
      );
    this.subscribedService.push(drawingStatus);
  }

  //This dialog box use for all.

  addDrgstatus($event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditdrawingstatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add Drawing Status',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetDrawingStatus();
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

  //this the delete method for all masters

  deleteItem(row: any, $event: MouseEvent) {
    console.log(row);
    let data = {
      drawingStatusId: row.Id,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    //this dialogref is same for all masters

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.drawingservice.deleteDrawingStatus(data).subscribe((res: any) => {
          console.log(res);
          if (res[0].SuccessMessage) {
            this.toster.success(res[0].SuccessMessage, 'SUCCESS');
            this.GetDrawingStatus();
            window.location.reload();
          }
        });
      }
    });
  }

  //if we click we get this dialog box for edit,

  editItem(row: any, $event: MouseEvent) {
    const dialogRef = this.dialog.open(AddeditdrawingstatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update Drawing Status',
        button: 'Update',
        view: false,
        value: row,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.GetDrawingStatus();
      }
    });
  }
}
