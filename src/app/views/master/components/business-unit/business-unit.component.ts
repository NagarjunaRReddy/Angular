import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelperService } from '../../../../services/helper.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BusinessUnitService } from '../../../../services/business-unit.service';
import { BaseService } from '../../../../base/base.service';
import { AddEditBusinessUnitComponent } from './add-edit-business-unit/add-edit-business-unit.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { BusinessSelectEntity } from '../../../../interfaces/user-management-interface';
import { BusinessUnitDeleteEntity } from '../../../../interfaces/business-unit-entity';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { MasterdetailsService } from '../../../../services/masterdetails.service';

@Component({
  selector: 'app-business-unit',
  templateUrl: './business-unit.component.html',
  styleUrl: './business-unit.component.scss',
})
export class BusinessUnitComponent {
  // View child decorators for Material table components
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  // Table data source and configuration
  public dataSource = new MatTableDataSource<any>();
  subscribedService: Subscription[] = []; // Array to store subscriptions
  columns: any; // Column definitions
  public displayedColumns: string[] | undefined;

  // User and menu related properties
  loginInfo: any;
  menuData: any;
  menuAccess: any;
  subMenuAccess: any;
  iconUrl: any;

  columnNames: string[] = [];
  headerName: string[] = [];
  allSBusinessMaster: any[] = [];
  mappedData: any[] = [];
  frmBusinessunit!: FormGroup;
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
  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private businessService: BusinessUnitService,
    private baseService: BaseService,
    private masterDetailService: MasterdetailsService
  ) {}
  ngOnInit(): void {
    // Get user and menu information from storage
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}');
    this.iconUrl = this.baseService.iconUrl;

    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);

    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);

    this.loadTable = true;

    this.frmBusinessunit = this.formBuilder.group({
      // excelsheet:[''],
      fromDate: [null],
      toDate: [null],
      siteId: [0],
      statusId: [0], //sales resposible
      searchTab: [''],
    });

    
    this.getColumn();
    this.setMenuAccess();
  }

  setMenuAccess() {
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
    console.log(this.menuAccess);
    this.subMenuAccess = this.menuAccess[0].children.map(
      (e: any)=>{
        return e
      }
    );
    console.log(this.subMenuAccess);
  }

  getIMageFile(image: string) {
    return `${this.iconUrl}${image}`;
  }
  getColumn(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Business Unit',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const businessService = this.masterDetailService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action'];
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getBusinessData();
            
            
          }
        },
        (error: any) => {
          console.error('Error fetching master Details:', error);
        }
      );
    this.subscribedService.push(businessService);
  }

 
  

  getBusinessData() {
    const businessData: BusinessSelectEntity = {
      BusinessUnitId: 0, //JSON.parse(this.helperService.getUserBusinessId()),//this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const businessService = this.businessService
      .BusinessUnitSelect(businessData)
      .subscribe(
        (res: any) => {
          // console.log(res);
          if (res && res.length && !res[0]?.Message) {
            // console.log(res);

            this.allSBusinessMaster = res;
            // const mappedData = res.map((item:any) => {
            //   const row:any = {};
            //   this.columnNames.forEach((col,index) => {
            //     row[col] = item[col] ; // Handle missing values

            //   });
            //   return row;
            // });

            this.dataSource.data = res.map((item: any, index: number) => {
              return {
                SlNo: index + 1,
                ...item,
              };
            });
            // console.log(this.dataSource.data);
          }
        },
        (error) => {
          console.error('Some error occurred', error);
        }
      );
    this.subscribedService.push(businessService);
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addBusiness(event: Event): void {
    try {
      event.stopPropagation();
      const dialogRef = this.dialog.open(AddEditBusinessUnitComponent, {
        width: '35%',
        data: {
          title: 'Add Business Unit',
          button: 'Save',
          view: false,
        },
        disableClose: true,
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result === true) {
            this.getBusinessData();
          }
        })
        .catch((error) => {
          console.error('Dialog error:', error);
          this.toastr.error('Error adding business unit', 'ERROR');
        });
    } catch (error) {
      console.error('Error in addBusiness:', error);
      this.toastr.error('Error opening add dialog', 'ERROR');
    }
  }

  /**
   * Open dialog to edit business unit
   */
  editItem(row: any, event: Event): void {
    try {
      event.stopPropagation();
      const dialogRef = this.dialog.open(AddEditBusinessUnitComponent, {
        width: '35%',
        data: {
          title: 'Update Business Unit',
          button: 'Update',
          view: false,
          value: row,
        },
        disableClose: true,
      });

      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result === true) {
            this.getBusinessData();
          }
        })
        .catch((error) => {
          console.error('Dialog error:', error);
          this.toastr.error('Error updating business unit', 'ERROR');
        });
    } catch (error) {
      console.error('Error in editBusiness:', error);
      this.toastr.error('Error opening edit dialog', 'ERROR');
    }
  }

  deleteItem(row: any, event: Event): void {
    try {
      event.stopPropagation();
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '30%',
        data: {
          title: 'Confirm Action',
          message: 'Are you sure you want to delete?',
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result === true) {
            const businessData: BusinessUnitDeleteEntity = {
              BusinessUnitId: row.BusinessUnitId,
            };

            const businessDeleteService = this.businessService
              .BusinessUnitDelete(businessData)
              .subscribe({
                next: (res: any) => {
                  if (res[0].ResultMessage) {
                    this.toastr.success(res[0].ResultMessage, 'Success');
                  } else {
                    this.toastr.error(res[0].ErrorMessage, 'Error');
                  }
                  window.location.reload();
                  this.getBusinessData();
                },
                error: (error) => {
                  console.error('Delete error:', error);
                  this.toastr.error('Error deleting business unit', 'ERROR');
                },
              });

            this.subscribedService.push(businessDeleteService);
          }
        },
        error: (error) => {
          this.toastr.error('Error in delete operation', 'ERROR');
        },
      });
    } catch (error) {
      this.toastr.error('Error processing delete request', 'ERROR');
    }
  }

  applyFilter(event: Event): void {
    try {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {
      console.error('Error applying filter:', error);
      this.toastr.error('Error filtering data', 'ERROR');
    }
  }
  ngOnDestroy(): void {
    try {
      this.subscribedService.forEach((subscription) => {
        subscription.unsubscribe();
      });
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}
