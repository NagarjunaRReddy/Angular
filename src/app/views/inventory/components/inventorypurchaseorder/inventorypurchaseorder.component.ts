import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { SiteService } from '../../../../services/site.service';
import { Router } from '@angular/router';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InventoryService } from '../../services/inventory.service';
import { VendorService } from '../../../../services/vendor.service';
import { SiteSelectEntity } from '../../../../interfaces/siteentity';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-inventorypurchaseorder',
  templateUrl: './inventorypurchaseorder.component.html',
  styleUrl: './inventorypurchaseorder.component.scss',
})
export class InventorypurchaseorderComponent implements OnInit, AfterViewInit {
  frmInventoryPurchaseorder!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscribedService: Subscription[] = [];
  allSiteMaster: any[] = [];
  allVendor: any[] = [];
  minToDate!: Date;
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

  displayedColumns: string[] = [
    'PurchaseOrder',
    'ItemId',
    'ProductName',
    'VendorName',
    'ArrivalDate',
    'Site',
    'Quantity',
    'ProductionPool',
  ];
  public dataSourcesearch: any[] = [];
  private destroy$ = new Subject<void>(); // Subject for unsubscribing
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loadTable: boolean = false;
  unsubscribe$ = new Subject<void>();
  datasourceFilter: any[] = [];
  columns: any[] = [
    { columnDef: 'PurchaseOrder', header: 'Purchase Order', id: 1 },
    { columnDef: 'ItemId', header: 'Item-Id', id: 2 },
    { columnDef: 'ProductName', header: 'Product Name', id: 3 },
    { columnDef: 'VendorName', header: 'Vendor Name', id: 4 },
    { columnDef: 'ArrivalDate', header: 'Arrival Date', id: 5 },
    { columnDef: 'Site', header: 'Site ', id: 6 },
    { columnDef: 'Quantity', header: 'Quantity', id: 7 },
    { columnDef: 'ProductionPool', header: 'Production Pool', id: 8 },
  ];
  dataForExcel = [];

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private inventoryService: InventoryService,
    private vendorService: VendorService,
    private excelService: ExportExcelService
  ) {}
  ngOnInit(): void {
    this.frmInventoryPurchaseorder = this.formBuilder.group({
      //** FormControl Names */
      siteId: ['0'],
      vendorId: ['0'],
      searchTab: [''],
    });
    this.getSiteData();
    this.displayedColumns = this.columns.map((col) => col.columnDef);

    this.getPurcahseOrderData();

    this.getVendor();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getVendor() {
    const AxInventoryService = this.vendorService
      .getVendorName()

      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          console.log(res, 'vendor');
          if (!res[0].Message) {
            this.allVendor = res;
            console.log(this.allVendor, 'this.allVendor');
          }
        },
      });
  }
  getPurcahseOrderData() {
    const AxInventoryService = this.inventoryService
      .PurchaseOrderFrom()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          console.log(res, 'res');
          if (!res[0].Message) {
            this.dataSource.data = res;
            this.dataSourcesearch = res;
            this.datasourceFilter = res;
            this.dataSource.paginator = this.paginator;
            console.log(this.dataSource, 'purcahseorder');
          }
        },
      });
  }
  getSiteData() {
    const siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const siteGetService = this.siteService.getSite(siteData).subscribe(
      (res: any) => {
        console.log(res, 'ressite');
        if (!res[0].Message) {
          this.allSiteMaster = res;
          console.log(this.allSiteMaster, 'this.allSiteMaster');
        }
      },
      (error) => {
        //this.toastr.error('Some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(siteGetService);
  }
  filterData() {
    let site =
      this.frmInventoryPurchaseorder.controls['siteId'].value == 0
        ? null
        : this.frmInventoryPurchaseorder.controls['siteId'].value;
    let vendorName =
      this.frmInventoryPurchaseorder.controls['vendorId'].value == 0
        ? null
        : this.frmInventoryPurchaseorder.controls['vendorId'].value;
    this.frmInventoryPurchaseorder.controls['searchTab'].setValue('');
    let selectedMembers = this.dataSourcesearch;

    if (site != null) {
      selectedMembers = selectedMembers.filter(
        (f: { Site: string }) => f.Site?.toLowerCase() == site.toLowerCase()
      );
    }

    if (vendorName != null) {
      selectedMembers = selectedMembers.filter(
        (f: { VendorName: string }) =>
          f.VendorName?.toLowerCase() == vendorName?.toLowerCase()
      );
    }

    this.dataSource = new MatTableDataSource(selectedMembers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  ngOnDestroy(): void {
    // Important: unsubscribe to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
  doFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clearFilter() {
    this.frmInventoryPurchaseorder.controls['siteId'].setValue(0);
    this.frmInventoryPurchaseorder.controls['vendorId'].setValue(0);
    this.dataSource.data = this.datasourceFilter;
    this.frmInventoryPurchaseorder.controls['searchTab'].setValue('');
    this.filterData();
  }
  ConvertDate(date: any): string {
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ''; // Return empty string if the date is invalid
      }

      const cdate = this.datepipe.transform(parsedDate, 'MM/dd/yy');
      if (cdate === '01/01/00' || cdate === '01/01/01' || cdate === null) {
        return '';
      } else {
        return cdate;
      }
    } else {
      return '';
    }
  }
  exportExcel() {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yy h:mm:ss'
    );
    this.dataForExcel = [];
    let excelColumns = this.columns.map((column: any) => {
      if (column.header == 'Arrival Date') {
        return column.header + '(DD/MM/YYYY)';
      } else {
        return column.header;
      }
    });
    this.dataSource.filteredData.forEach((row: any) => {
      let excelData = {
        ['Purchase Order']: row.PurchaseOrder,
        ['Item-Id']: row.ItemId,
        ['Product Name']: row.ProductName,
        ['Vendor Name']: row.VendorName,
        ['Arrival Date(DD/MM/YYYY)']: this.ConvertDate(row.ArrivalDate)
          ? new Date(row.ArrivalDate)
          : '',
        ['Site ']: row.Site,
        ['Quantity']: row.Quantity,
        ['Production Pool']: row.ProductionPool,
      };
      let rowValues = excelColumns.map((column: any) => excelData[column]);
      this.dataForExcel.push(Object.values(rowValues));
    });

    let reportData = {
      image: 'assets/images/Fouts-Fire.png',
      title: 'AX Inventory',
      data: this.dataForExcel,
      headers: excelColumns,
      excelfilename: 'AX Inventory' + currentDateTime,
      sheetname: 'AXInventory',
    };

    if (this.dataForExcel && this.dataForExcel.length > 0) {
      this.excelService.exportExcel(reportData);
    } else {
      this.toastr.error('No data to display');
    }
  }
}
