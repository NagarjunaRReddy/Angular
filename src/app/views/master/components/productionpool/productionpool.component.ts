import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductionPoolService } from '../../../../services/production-pool.service';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  ProductionPoolDeleteEntity,
  ProductionPoolSelectEntity,
} from '../../../../interfaces/production-pool';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddeditproductionpoolComponent } from './addeditproductionpool/addeditproductionpool.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productionpool',
  templateUrl: './productionpool.component.html',
  styleUrl: './productionpool.component.scss',
})
export class ProductionpoolComponent {
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
  frmproductionStatus!: FormGroup;
  loadTable: boolean = false;
  displayedColumns: string[] = [];
  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allProductionPool: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
menuAccess: any;
  subMenuAccess: any;

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private productionpoolService: ProductionPoolService,
    private router:Router
  ) {}

  ngOnInit() {
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}');
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);

    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);

    this.loadTable = true;

    this.frmproductionStatus = this.formBuilder.group({
      // excelsheet:[''],
      searchTab: [''],
    });

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
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Productionpool',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const ProductionPoolService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames.push('Site');
            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action'];
            

            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getProductionPool();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(ProductionPoolService);
  }

  getProductionPool() {
    const ActionData: ProductionPoolSelectEntity = {
      productionPoolId: 0,
      tenantId: this.loginInfo.tenantId ? this.loginInfo.tenantId : 0,
    };
    const ProductionPool = this.productionpoolService
      .GetProductionPool(ActionData)
      .subscribe(
        (res: any) => {
          if (res != null && !res[0]?.Message) {
            this.allProductionPool = res;
            console.log(res,'sitedata')
            // const mappedData = res.map((item: any) => {
            //   const row: any = {};
            //   this.columnNames.forEach((col, index) => {
            //     row[col] = item[col] ;
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
          console.error('Some Error Occured', error);
        }
      );
    this.subscribedService.push(ProductionPool);
  }

  dateteItem(element: any, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let AttachmentData: ProductionPoolDeleteEntity = {
          productionPoolId: element.ProductionPoolId,
        };
        const AttachmenService = this.productionpoolService
          .DeleteProductionPool(AttachmentData)
          .subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toster.error(res[0].ErrorMessage, 'Error');
              }
              window.location.reload();
              this.getProductionPool();
            },
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(AttachmenService);
      }
    });
  }

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditproductionpoolComponent, {
      width: '35%',
      data: {
        title: 'Update Production Pool',
        button: 'Update',
        view: false,
        value: element,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getProductionPool();
        }
      })
      .catch((error) => {
        this.toster.error('Error In Updating production pool Status', 'ERROR');
      });
  }

  addProductionpool(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditproductionpoolComponent, {
      width: '35%',
      data: {
        title: 'Add Production Pool',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getProductionPool();
          window.location.reload();
        }
      })
      .catch((error) => {
        this.toster.error('Error Occured', error);
      });
  }
  applyFilter(event: Event | string) {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
