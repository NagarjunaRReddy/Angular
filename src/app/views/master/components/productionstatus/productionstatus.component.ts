import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { ProductionStatusService } from '../../../production-planning/services/production-status.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  DeleteProductionStatusEntitties,
  selectProductionStatusEntitties,
} from '../../../../interfaces/productionstatus';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddeditproductionstatusComponent } from './addeditproductionstatus/addeditproductionstatus.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productionstatus',
  templateUrl: './productionstatus.component.html',
  styleUrl: './productionstatus.component.scss',
})
export class ProductionstatusComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmProduction!: FormGroup;
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
  displayedColumns: string[] = [];

  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allProductionMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;
menuAccess: any;
  subMenuAccess: any;

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private productionService: ProductionStatusService,
    private dialog: MatDialog,
    private toster: ToastrService,
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

    this.frmProduction = this.formBuilder.group({
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Production',
      TenantId: 0, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,//1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const ProductionService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          console.log(res, 'Coloumns');
          if (!res[0]?.Message) {
            //this.displayedColumns = res.map((item: any) => item.DisplayName);
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            //this.columnNames = res.map((item: any) => item.ColumnName);
            this.columnNames = res.map((item) => item.ColumnName);

            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action'];
            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getProductionStatus();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(ProductionService);
  }
  getProductionStatus() {
    const ProductionData: selectProductionStatusEntitties = {
      AxProdStatusId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Replace dynamically if needed
    };

    const ProductionGetService = this.productionService
      .ProductionStatusSelect(ProductionData)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res && res.length && !res[0]?.Message) {
            this.allProductionMaster = res;
            // this.columnNames = [ 'ProductionStatusName', 'Action']
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

    this.subscribedService.push(ProductionGetService);
  }

  deleteItem(element: any, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let ProductionData: DeleteProductionStatusEntitties = {
          Id: element.Id,
        };
        const ProductionmasterService = this.productionService
          .ProductionStatusDelete(ProductionData)
          .subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toster.error(res[0].ErrorMessage, 'Error');
              }
              window.location.reload();
              this.getProductionStatus();
            },
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(ProductionmasterService);
      }
    });
  }

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditproductionstatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update Production Status',
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
          this.getProductionStatus();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        this.toster.error('Error in Updating Production-Status', 'ERROR');
      });
  }
  addProduction(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditproductionstatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add Production Status',
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
          this.getProductionStatus();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
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
