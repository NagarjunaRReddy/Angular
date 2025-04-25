import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { Subscription } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SiteService } from '../../../../services/site.service';
import {
  SiteDeleteEntity,
  SiteSelectEntity,
} from '../../../../interfaces/siteentity';
import { MatDialog } from '@angular/material/dialog';
import { AddeditsiteComponent } from './addeditsite/addeditsite.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-master',
  templateUrl: './site-master.component.html',
  styleUrl: './site-master.component.scss',
})
export class SiteMasterComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  frmSite!: FormGroup;
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
  allSiteMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;
  capacity: any;
menuAccess: any;
  subMenuAccess: any;

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private siteService: SiteService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.capacity = JSON.parse(this.helperService.getValue('Capacity'));
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}');
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    console.log(table);

    this.settings = JSON.parse(table);
    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);
    this.loadTable = true;
    this.frmSite = this.formBuilder.group({
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
      MasterName: 'Site',
      TenantId: 0, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,//1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const siteService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            this.displayedColumns = ['Sl.No.', ...this.displayedColumns];
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames = ['Sl.No.', ...this.columnNames];
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getSiteMaster();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(siteService);
  }

  getSiteMaster() {
    const siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Replace dynamically if needed
    };

    const siteGetService = this.siteService.getSite(siteData).subscribe(
      (res: any) => {
        if (res && res.length && !res[0]?.Message) {
          this.allSiteMaster = res;
          console.log(res, 'Site Master');
          this.dataSource.data = res.map((item: any, idx: any) => {
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

    this.subscribedService.push(siteGetService);
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
        let SiteData: SiteDeleteEntity = {
          SiteId: element.SiteId,
        };
        const sitemasterService = this.siteService
          .deleteSite(SiteData)
          .subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success',
                  {
                    timeOut:3000,
                    progressBar: true, // Shows a progress bar
                    closeButton: true, 
                  }
                  
                );

              } 
              

              else {
                this.toster.error(res[0].ErrorMessage, 'Error',
                  {
                    timeOut:3000,
                    progressBar: true, // Shows a progress bar
                    closeButton: true, 
                  }
                );
              }

              if((res[0].SuccessMessage))
              {
                      window.location.reload();
              }
              
              this.getSiteMaster();
              //window.location.reload();
            },
            
             
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(sitemasterService);
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
    const dialogRef = this.dialog.open(AddeditsiteComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update Site',
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
          this.getSiteMaster();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
        this.toster.error('Error in Updating Site', 'ERROR');
      });
  }
  addSite(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditsiteComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add Site',
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
          this.getSiteMaster();
        }
      })
      .catch((error) => {
        console.error('Error occurred:', error);
      });
  }
}
