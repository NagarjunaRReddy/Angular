import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemMasterService } from '../../services/item-master.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { Bigpartsitem } from '../../../../interfaces/bigpartsitem';
import { EditItemMasterComponent } from './edit-item-master/edit-item-master.component';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrl: './item-master.component.scss',
})
export class ItemMasterComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  columnMap: { [key: string]: string } = {};
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
menuAccess: any;
  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private itemMasterService: ItemMasterService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);
    console.log(this.settings, 'this.settings');

    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);
    console.log(this.themeSettings, 'this.themeSettings');

    this.loadTable = true;

    this.frmSite = this.formBuilder.group({
      // excelsheet:[''],

      searchTab: [''],
    });

    this.getColumns();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // getColumns(): void {
  //   const masterDetailsEntity: MasterDetailsEntity = {
  //     MasterName: 'ItemMaster',
  //     TenantId: 1 // Assuming static value or retrieve from loginInfo.TenantId
  //   };

  //   const siteService = this.masterdetailsService
  //     .getMasterDetailsByName(masterDetailsEntity)
  //     .subscribe(
  //       (res: any) => {
  //         if (!res[0]?.Message) {
  //           this.displayedColumns = res.map((item: any) => item.DisplayName);
  //           this.columnNames = res.map((item: any) => item.ColumnName);

  //           // Include a "select" column if multiselect is enabled
  //           if (this.settings.IsMultiselect) {
  //             this.displayedColumns.unshift('select');
  //           }

  //           console.log('Columns initialized:', this.displayedColumns);

  //           // Fetch data only after initializing columns
  //           this.getBigPartItem();
  //         }
  //       },
  //       (error: any) => {
  //         console.error('Error fetching master details:', error);
  //       }
  //     );

  //   this.subscribedService.push(siteService);
  // }
  // getSiteMaster() {
  //   const siteData: SiteSelectEntity = {
  //     SiteId: 0,
  //     TenantId:1// this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
  //   };

  //   const siteGetService = this.siteService.getSite(siteData).subscribe(
  //     (res: any) => {
  //       console.log(res,"res");
  //       if (!res[0].Message) {
  //         this.allSiteMaster = res;
  //         const mappedData = res.map((item: any) => {
  //           const row: any = {};
  //           this.columnNames.forEach((col, index) => {
  //             row[col] = item[col]; // Handle missing values
  //           });
  //           return row;
  //         });
  //         this.dataSource.data = mappedData;
  //       }
  //     },
  //     (error) => {
  //       //this.toastr.error('Some Error Occured', 'ERROR');
  //     }
  //   );
  //   this.subscribedService.push(siteGetService);
  // }
  // getSiteMaster() {
  //   const siteData: SiteSelectEntity = {
  //     SiteId: 0,
  //     TenantId: 1, // Replace dynamically if needed
  //   };

  //   const siteGetService = this.siteService.getSite(siteData).subscribe(
  //     (res: any) => {
  //       console.log(res, "res");

  //       if (res && res.length && !res[0]?.Message) {
  //         this.allSiteMaster = res;

  //         // Extract columns dynamically and include 'Actions'
  //         this.columnNames = Object.keys(res[0]);
  //         if (!this.columnNames.includes('Actions')) {
  //           this.columnNames.push('Actions'); // Add Actions column if not already present
  //         }

  //         // Prepare data for the table
  //         this.dataSource.data = res.map((item: any) => ({
  //           ...item,
  //           Actions: 'action', // Add a placeholder for Actions column
  //         }));
  //       }
  //     },
  //     (error) => {
  //       console.error("Some error occurred", error);
  //     }
  //   );

  //   this.subscribedService.push(siteGetService);
  // }

  // getBigPartItem() {
  //    const bigpartsitemData: Bigpartsitem = {
  //     ItemId: 0

  //       };

  //   const siteGetService = this.itemMasterService.getBigPartsItem(bigpartsitemData).subscribe(
  //     (res: any) => {
  //       console.log(res, "res");

  //       if (res && res.length && !res[0]?.Message) {
  //         //this.allSiteMaster = res;

  //         // Extract columns dynamically and include 'Actions'
  //         // this.displayedColumns = Object.keys(res[0]);
  //         // if (!this.displayedColumns.includes('Actions')) {
  //         //   this.displayedColumns.push('Actions'); // Add Actions column if not already present
  //         // }

  //         // Prepare data for the table
  //         // this.dataSource.data = res.map((item: any) => ({
  //         //   ...item,
  //         //   //Actions: 'action', // Add a placeholder for Actions column
  //         // }));

  //         const mappedData = res.map((item: any) => {
  //           console.log(item,"item");
  //           const row: any = {};
  //           this.columnNames.forEach((col, index) => {
  //             console.log(row,"row");
  //             row[col] = item[col] || ''; // Handle missing values
  //           });
  //           return row;
  //         });
  //         this.dataSource.data = mappedData;
  //         console.log(mappedData,"mappedData")
  //         console.log(this.columnNames,"this.columnNames")
  //       }

  //     },
  //     (error) => {
  //       console.error("Some error occurred", error);
  //     }
  //   );

  //   this.subscribedService.push(siteGetService);
  // }
  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'ItemMaster',
      TenantId: 1, // Assuming static value or retrieve from loginInfo.TenantId
    };

    const siteService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((item: any) => item.DisplayName); // UI Column Names
            this.columnNames = res.map((item: any) => item.ColumnName); // Actual API Field Names

            // Create a mapping from DisplayName to actual ColumnName
            this.columnMap = res.reduce((map: any, item: any) => {
              map[item.DisplayName] = item.ColumnName; // e.g., {"Item Name": "ItemName"}
              return map;
            }, {});

            // Include "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }

            console.log('Columns initialized:', this.displayedColumns);
            console.log('Column Map:', this.columnMap);

            // Fetch data only after initializing columns
            this.getBigPartItem();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(siteService);
  }

  getBigPartItem() {
    const bigpartsitemData: Bigpartsitem = {
      ItemId: 0,
    };

    const bigPartsData = this.itemMasterService
      .getBigPartsItem(bigpartsitemData)
      .subscribe(
        (res: any) => {
          console.log(res, 'res');

          if (res && res.length && !res[0]?.Message) {
            // Map API response to match dynamically generated columns
            const mappedData = res.map((item: any) => {
              const row: any = {};
              this.displayedColumns.forEach((col) => {
                const actualKey = this.columnMap[col] || col; // Use mapped name or fallback to col
                row[col] = item[actualKey] !== undefined ? item[actualKey] : ''; // Handle missing values
              });
              return row;
            });

            this.dataSource.data = mappedData;

            console.log(mappedData, 'mappedData');
            console.log(this.columnNames, 'this.columnNames');
          }
        },
        (error) => {
          console.error('Some error occurred', error);
        }
      );

    this.subscribedService.push(bigPartsData);
  }

  deleteItem(_t48: any) {
    throw new Error('Method not implemented.');
  }
  editItem(row: any, event: Event) {
    try {
      event.stopPropagation();
      const dialogRef = this.dialog.open(EditItemMasterComponent, {
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
            this.getBigPartItem();
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
}
