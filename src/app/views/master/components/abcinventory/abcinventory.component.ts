import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  AbcInventoryDelete,
  selectAbcInventory,
} from '../../../../interfaces/abcInventory-entiry';
import { AbcinventoryService } from '../../../../services/abcinventory.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { Title } from '@angular/platform-browser';
import { AddeditabcinventoryComponent } from './addeditabcinventory/addeditabcinventory.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abcinventory',
  templateUrl: './abcinventory.component.html',
  styleUrl: './abcinventory.component.scss',
})
export class AbcinventoryComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  frmAbcInventory!: FormGroup;
  loadTable: boolean = false;
  displayedColumns: string[] = [];
  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allabcinventoryMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;
  subMenuAccess: any;
  menuAccess: any;
  

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private AbcInventoryService: AbcinventoryService,
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

    this.frmAbcInventory = this.formBuilder.group({
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
      MasterName: 'ABC',
      TenantId: 0, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,//1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const siteService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            //this.displayedColumns = res.map((item: any) => item.DisplayName);
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            //this.columnNames = res.map((item: any) => item.ColumnName);
            this.columnNames = res.map((item) => item.ColumnName);

            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action']; //here add what columns you want
            //'SiteId',
            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getAbcInventory();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(siteService);
  }

  getAbcInventory() {
    const AbcData: selectAbcInventory = {
      abcInventoryId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const AbcGetService = this.AbcInventoryService.getAbcInventory(
      AbcData
    ).subscribe(
      (res: any) => {
        if (res != null && !res[0]?.Message) {
          this.allabcinventoryMaster = res;
          this.dataSource.data = res.map((item: any, idx: number) => {
            return {
              SlNo: idx + 1,
              ...item,
            };
          });
        }
      },
      (error) => {
        console.error('Some Error occured', error);
      }
    );
    this.subscribedService.push(AbcGetService);
  }

  deleteItem(element: any, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let AbcData: AbcInventoryDelete = {
          abcInventoryId: element.Id,
        };
        const AbcdInventoryService =
          this.AbcInventoryService.deleteAbcInventory(AbcData).subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toster.error(res[0].ErrorMessage, 'Error');
              }
              
              this.getAbcInventory();
              location.reload();
            },
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(AbcdInventoryService);
      }
    });
  }

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditabcinventoryComponent, {
      width: '35%',
      data: {
        title: 'Update ABC Inventory',
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
          this.getAbcInventory();
        }
      })
      .catch((error) => {
        this.toster.error('Error In Updating AbcInventory', 'ERROR');
      });
  }

  addAbcInventory(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditabcinventoryComponent, {
      width: '35%',
      data: {
        title: 'Add ABC Inventory',
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
          this.getAbcInventory();
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
