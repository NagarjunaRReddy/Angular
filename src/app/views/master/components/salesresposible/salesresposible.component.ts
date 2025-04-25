import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { SalesResposibleService } from '../../../../services/sales-resposible.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  SalesResponsibleDeleteEntity,
  SalesResposibleSelectEntity,
} from '../../../../interfaces/sales-resposible';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddeditsalesresposibleComponent } from './addeditsalesresposible/addeditsalesresposible.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salesresposible',
  templateUrl: './salesresposible.component.html',
  styleUrl: './salesresposible.component.scss',
})
export class SalesresposibleComponent {
  frmSalesResponsible!: FormGroup;
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
  allSalesResponsibleMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
menuAccess: any;
  subMenuAccess: any;

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private SalesResponsibleService: SalesResposibleService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private router: Router
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

    this.frmSalesResponsible = this.formBuilder.group({
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
    this.dataSource.paginator = this.paginator;
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'salesResponsible',
      TenantId: 0, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,//1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const SalesResponsibleService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          console.log(res, 'Coloumns');
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            this.columnNames = res.map((item) => item.ColumnName);

            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action'];
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
           
            // Fetch data only after initializing columns
            this.getSalesResponsible();
          }
          
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(SalesResponsibleService);
  }
  getSalesResponsible() {
    const SalesResponsibleData: SalesResposibleSelectEntity = {
      salesResposibleId: 0,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Replace dynamically if needed
    };

    const SalesResponsibleGetService =
      this.SalesResponsibleService.GetSalesResposible(
        SalesResponsibleData
      ).subscribe(
        (res: any) => {
          console.log(res);
          if (res && res.length && !res[0]?.Message) {
            this.allSalesResponsibleMaster = res;
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

    this.subscribedService.push(SalesResponsibleGetService);
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
        let SalesResponsibleData: SalesResponsibleDeleteEntity = {
          salesResposibleId: element.Id,
          modifiedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        };
        const SalesResponsibleService =
          this.SalesResponsibleService.DeleteSalesResposible(
            SalesResponsibleData
          ).subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toster.error(res[0].ErrorMessage, 'Error');
              }
              window.location.reload();
              this.getSalesResponsible();
            },
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(SalesResponsibleService);
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

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditsalesresposibleComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update Sales Responsible',
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
          this.getSalesResponsible();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        this.toster.error('Error in Updating SalesResponsible', 'ERROR');
      });
  }
  addSalesResponsible(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditsalesresposibleComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add Sales Responsible',
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
          this.getSalesResponsible();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
      });
  }
}
