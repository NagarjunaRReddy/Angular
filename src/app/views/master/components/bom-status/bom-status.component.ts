import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, window } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { BomService } from '../../../production-planning/services/bom.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  BOMStatusDeleteEntity,
  BOMStatusSelectEntity,
} from '../../../production-planning/interfaces/bom-interface';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddeditBomStatusComponent } from './addedit-bom-status/addedit-bom-status.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bom-status',
  templateUrl: './bom-status.component.html',
  styleUrl: './bom-status.component.scss',
})
export class BomStatusComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  frmBomStatus!: FormGroup;
  loadTable: boolean = false;
  displayedColumns: string[] = [];
  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allBomstatusMaster: any[] = [];
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
    private BomService: BomService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private router: Router
  ) { }
  ngOnInit(): void {
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

    this.frmBomStatus = this.formBuilder.group({
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
      MasterName: 'BOMStatus',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const bomstatusService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            //this.displayedColumns = res.map((item: any) => item.DisplayName);
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            //this.columnNames = res.map((item: any) => item.ColumnName);
            this.columnNames = res.map((item) => item.ColumnName);

            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action']; //here add what columns you want
            //'Id',
            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }

            // Fetch data only after initializing columns
            this.getbomMaster();
          }
        },
        (error: any) => {
          // console.error('Error fetching master details:', error);
          this.toster.error(error);
        }
      );

    this.subscribedService.push(bomstatusService);
  }

  getbomMaster() {
    const bomData: BOMStatusSelectEntity = {
      BOMStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Replace dynamically if needed
    };

    const bomGetService = this.BomService.GetBom(bomData).subscribe(
      (res: any) => {
        if (res && res.length && !res[0]?.Message) {
          this.allBomstatusMaster = res;
          //'Id',
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
        //console.error("Some error occurred", error);
        this.toster.error(error);
      }
    );

    this.subscribedService.push(bomGetService);
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
    dialogRef.afterClosed().subscribe((result) =>
   {
      if (result == true) {
        let BomData: BOMStatusDeleteEntity = 
        {
          BOMStatusId: element.Id,
        };
        const bomstatusService = this.BomService.deleteBom(BomData).subscribe(
          (res: any) => {
            if (res[0].SuccessMessage) {
              this.toster.success(res[0].SuccessMessage, 'Success');
              
            } else {
              this.toster.error(res[0].ErrorMessage, 'Error');
            }
         

            
            this.getbomMaster();
            location.reload();
            
          },
          (error) => {
            this.toster.error('Some Error Occured', 'ERROR');
          }
        );
        this.subscribedService.push(bomstatusService);
      }
    });
  }


  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditBomStatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update BOM Status',
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
          this.getbomMaster();
        }
      })
      .catch((error) => {
        //  console.error('Error occurred:', error);
        this.toster.error(error);
      });
  }
  addBomStatus(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditBomStatusComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add BOM Status',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true)
        {
          this.getbomMaster();
        }
      })
      .catch((error) => {
        //console.error('Error occurred:', error);
        this.toster.error(error);
      });
  }
  applyFilter(event: Event | string)
  {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
         this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
