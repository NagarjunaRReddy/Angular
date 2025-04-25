import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SiteService } from '../../../../services/site.service';
import { DatePipe, formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from '../../services/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { SiteSelectEntity } from '../../../../interfaces/siteentity';
import { InventoryItemStatusSelectEntity } from '../../../../interfaces/inventoryitemstatus';
import { InventoryitemstatusService } from '../../../../services/inventoryitemstatus.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { InventoryItemStatusFilter } from '../../interfaces/inventory-item-status-filter';

@Component({
  selector: 'app-inventorystatus',
  templateUrl: './inventorystatus.component.html',
  styleUrl: './inventorystatus.component.scss',
})
export class InventorystatusComponent implements OnInit {
  frmInventoryStatus!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscribedService: Subscription[] = [];

  allSiteMaster: any[] = [];
  minToDate!: Date;
  activeCategory: string = 'All';
  allStatusData: any[] = [];
  activeIndex: string = 'All';
  activeLink: any;
  dataSourceSearch: any[] = [];
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
    'salesId',
    'prodId',
    'po',
    'itemNumber',
    'quantity',
    'partsArrivalDate',
    'prodDeliveryDate',
    'status',
    'businessUnit',
    'inventoryStatus',
    'soDeliveryDate',
    'itemName',
    'site',
    'vendorId',
    'vendorName',
    'flagCriticalItemName',
    'referenceItemName',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loadTable: boolean = false;
  unsubscribe$ = new Subject<void>();
  salesIdList: any[] = [];
  filteredSoList: any[] = [];
  allItemNameList: any[] = [];
  filteredItemNameList: any[] = [];
  allItemNumberList: any[] = [];
  filteredItemNumberList: any[] = [];
  datasourceFilter: any[] = [];
  dataForExcel: any[];
  columns: any[] = [
    { columnDef: 'salesId', header: 'Sales Id', id: 1 },
    { columnDef: 'prodId', header: 'Prod Id', id: 2 },
    { columnDef: 'po', header: 'PO', id: 3 },
    { columnDef: 'itemNumber', header: 'Item Number', id: 4 },
    { columnDef: 'quantity', header: 'Quantity', id: 5 },
    {
      columnDef: 'partsArrivalDate',
      header: 'Parts Arrival Date',
      id: 6,
    },
    {
      columnDef: 'prodDeliveryDate',
      header: 'Prod Delivery Date',
      id: 7,
    },
    { columnDef: 'status', header: 'Status', id: 8 },
    { columnDef: 'businessUnit', header: 'Business Unit', id: 9 },
    {
      columnDef: 'inventoryStatus',
      header: 'Inventory Status',
      id: 10,
    },
    {
      columnDef: 'soDeliveryDate',
      header: 'SO Delivery Date',
      id: 11,
    },
    { columnDef: 'itemName', header: 'Item Name', id: 12 },
    { columnDef: 'site', header: 'Site', id: 13 },
    { columnDef: 'vendorId', header: 'Vendor Id', id: 14 },
    { columnDef: 'vendorName', header: 'Vendor Name', id: 15 },
    {
      columnDef: 'flagCriticalItemName',
      header: 'Flag Critical Item',
      id: 16,
    },
    { columnDef: 'referenceItemName', header: 'Reference Item Name', id: 17 },
  ];
  loginInfo: any = {};
  menuData: any;
  startOfMonth: string = '';
  endOfMonth: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private inventoryService: InventoryService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private InventoryStatusService: InventoryitemstatusService,
    private cd: ChangeDetectorRef,
    private excelService: ExportExcelService
  ) { }

  ngOnInit(): void {
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);
    this.loadTable = true;
    this.getSiteData();

    this.getStatusData();

    this.startOfMonth = formatDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      'MM-dd-yyyy',
      'en'
    ); // Start of the current month
    this.endOfMonth = formatDate(
      new Date(new Date().getFullYear(), new Date().getMonth(), 20), // 20th of the month
      'MM-dd-yyyy',
      'en'
    );

    this.frmInventoryStatus = this.formBuilder.group({
      //** FormControl */
      fromDate: [new Date(this.startOfMonth)], // Set the starting day of the current month
      toDate: [new Date(this.endOfMonth)], // Set the ending day of the current month
      siteId: ['0'], // Default value for siteId
      statusId: ['0'], // Default value for statusId
      searchTab: [''], // Default value for searchTab
    });
    this.applyFilterOnload();
  }

  doFilter(event: any) {
    //** Search Bar */
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyFilterOnload() {
    console.log(this.dataSource);
    const { fromDate, toDate, siteId, statusId } =
      this.frmInventoryStatus.value;

    const filterPayload: InventoryItemStatusFilter = {
      fromDate: formatDate(fromDate, 'yyyy-MM-dd', 'en'),
      toDate: formatDate(toDate, 'yyyy-MM-dd', 'en'),
      siteId: siteId == '0' ? null : siteId,
      statusId: statusId == '0' ? null : statusId,
    };

    const AxInventoryService = this.inventoryService
      .GetAxInventoryData(filterPayload)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          if (res && Array.isArray(res) && res.length > 0) {
            const formattedData = res.map((item: any) => {
              const partsArrivalDate = item.partsArrivalDate;
              const prodDeliveryDate = item.prodDeliveryDate;
              const soDeliveryDate = item.soDeliveryDate;
              return {
                ...item,
                prodDeliveryDate: this.ConvertDate(item.prodDeliveryDate),
                partsArrivalDate: this.ConvertDate(item.partsArrivalDate),
                soDeliveryDate: this.ConvertDate(item.soDeliveryDate),
              };
            });
            this.salesIdList = [
              ...new Set(res.map((item: any) => item.salesId)),
            ];
            this.filteredSoList = this.salesIdList;
            this.allItemNameList = [
              ...new Set(
                res
                  .filter((item) => item.itemName != '')
                  .map((item) => item.itemName)
              ),
            ];
            this.filteredItemNameList = this.allItemNameList;
            this.allItemNumberList = [
              ...new Set(
                res
                  .filter((item) => item.itemNumber != '')
                  .map((item) => item.itemNumber)
              ),
            ];
            this.filteredItemNumberList = this.allItemNumberList;

            this.dataSource.data = formattedData;
            this.datasourceFilter = formattedData;
            this.dataSourceSearch = formattedData;
            this.dataSource.paginator = this.paginator;
            this.cd.detectChanges();

            this.sort.active = 'prodDeliveryDate';
            this.sort.direction = 'asc';
            this.dataSource.sort = this.sort;
          } else {
            // Handle the case where the response is null or has an error message
            this.dataSource = new MatTableDataSource<any>();
            this.datasourceFilter = [];
            this.dataSourceSearch = [];
            this.dataSource.paginator = this.paginator;
            this.cd.detectChanges();
          }
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
    this.subscribedService.push(AxInventoryService);
  }

  getSiteData() {
    const siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const siteGetService = this.siteService.getSite(siteData).subscribe(
      (res: any) => {
        if (!res[0].Message) {
          this.allSiteMaster = res;
        }
      },
      (error) => {
        this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
      }
    );
    this.subscribedService.push(siteGetService);
  }
  applyFilter(): void {
    this.applyFilterOnload();
  }

  getStatusData() {
    const inventoryData: InventoryItemStatusSelectEntity = {
      InventoryItemId: 0,
      TenantId: 1, // Use this.loginInfo.TenantId if needed
    };

    this.InventoryStatusService.InventoryItemStatusSelect(inventoryData)
      .pipe(takeUntil(this.unsubscribe$)) // Unsubscribe on destroy
      .subscribe({
        next: (res: any) => {
          this.allStatusData = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }
  clearfilters() {
    this.frmInventoryStatus.controls['fromDate'].setValue(
      new Date(this.startOfMonth)
    );
    this.frmInventoryStatus.controls['toDate'].setValue(
      new Date(this.endOfMonth)
    );
    this.frmInventoryStatus.controls['siteId'].setValue('0');
    this.frmInventoryStatus.controls['statusId'].setValue('0');
    this.frmInventoryStatus.controls['searchTab'].setValue('');

    // Reset the data source to its original state
    this.dataSource.data = this.dataSourceSearch;
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort;

    // Reset the active links and categories
    this.activeLink = 'All';
    this.activeIndex = 'All';
    this.activeCategory = 'All';

    // Detect changes to update the UI
    this.cd.detectChanges();
    this.applyFilterOnload();
    window.location.reload();
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
  exportToExcel() {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yy h:mm:ss'
    );
    this.dataForExcel = [];
    let excelColumns = this.columns.map((column: any) => {
      if (
        column.header == 'Parts Arrival Date' ||
        column.header == 'Prod Delivery Date' ||
        column.header == 'SO Delivery Date'
      ) {
        return column.header + '(DD/MM/YYYY)';
      } else {
        return column.header;
      }
    });
    this.dataSource.filteredData.forEach((row: any) => {
      let exceldata = {
        ['Sales Id']: row.salesId,
        ['Prod Id']: row.prodId,
        ['PO']: row.po,
        ['Item Number']: row.itemNumber,
        ['Quantity']: row.quantity,
        ['Parts Arrival Date(DD/MM/YYYY)']: this.ConvertDate(
          row.partsArrivalDate
        )
          ? new Date(row.partsArrivalDate)
          : '',
        ['Prod Delivery Date(DD/MM/YYYY)']: this.ConvertDate(
          row.prodDeliveryDate
        )
          ? new Date(row.prodDeliveryDate)
          : '',
        ['Status']: row.status,
        ['Business Unit']: row.businessUnit,
        ['Inventory Status']: row.inventoryStatus,
        ['SO Delivery Date(DD/MM/YYYY)']: this.ConvertDate(row.soDeliveryDate)
          ? new Date(row.soDeliveryDate)
          : '',
        ['Item Name']: row.itemName,
        ['Site']: row.site,
        ['Vendor Id']: row.vendorId,
        ['Vendor Name']: row.vendorName,
        ['Flag Critical Item']: row.flagCriticalItemName,
        ['Reference Item Name']: row.referenceItemName,
      };
      // Extract values based on dynamicColumnNames
      let rowValues = excelColumns.map((column: any) => exceldata[column]);

      //rowValues = rowValues.filter(value => value !== undefined);
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
  // Validation of To Date enables after from Date is inserted
  updateMinToDate(selectedFromDate: Date): void {
    this.minToDate = selectedFromDate;
    this.frmInventoryStatus.controls['toDate'].setValue(null);
    this.frmInventoryStatus.controls['toDate'].enable();
  }
}
