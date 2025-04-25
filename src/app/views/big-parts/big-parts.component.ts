import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BigPartsService } from './services/big-parts.service';
import { ToastrService } from 'ngx-toastr';

import { Chasis, Site } from './interfaces/chasis';
import { Bigpartsitem } from '../../interfaces/bigpartsitem';
import { ItemMasterService } from '../master/services/item-master.service';
import { InventoryitemstatusService } from '../../services/inventoryitemstatus.service';
import { InventoryItemStatusSelectEntity } from '../../interfaces/inventoryitemstatus';
import { DatePipe } from '@angular/common';
import { ExportExcelService } from '../../services/export-excel.service';

@Component({
  selector: 'app-big-parts',
  templateUrl: './big-parts.component.html',
  styleUrl: './big-parts.component.scss',
})
export class BigPartsComponent implements OnInit {
  bigparts!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dataSourcesearch: any;
  partsListAx: any[];
  SiteList: any[];
  OtherDataList: any[];
  activeIndex: number = 0;
  activeValue: string = 'Chassis';
  minToDate!: Date;
  dataForExcel: any[];
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

  displayedColumns: any[] = [];
  displayedExcelColumns: any[] = [];
  dataSource = new MatTableDataSource([]);
  chasisStatusSelect: any[] = [];
  partsSelect: any[] = [];
  subscribedService: Subscription[] = [];
  columnNames: { columnDef: string; header: string }[];
  dataSourceSearch: any[] = [];
  datasourceFilter: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bigpartsService: BigPartsService,
    private itemMasterService: ItemMasterService,
    private cd: ChangeDetectorRef,
    private inventoryitemstatusService: InventoryitemstatusService,
    private toastr: ToastrService,
    private datepipe: DatePipe,
    private exportExcelService: ExportExcelService
  ) {}

  ngOnInit(): void {
    this.bigparts = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      siteId: ['0'],
      statusId: ['0'], //sales resposible
      ItemStatus: ['0'],
      searchTab: [''],
    });
    this.setActiveIndex(0, 'Chassis'); // Default to Chassis on load
    this.getPartList();
    this.getSiteList();
    this.getBigPartsOtherData();
    this.getChasisStatus();
    this.getinventoryItemStatus();
    this.dataSource.sort = this.sort;
    this.bigparts.controls['toDate'].disable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getinventoryItemStatus() {
    const status: InventoryItemStatusSelectEntity = {
      InventoryItemId: 0,
      TenantId: 1,
    };
    const partSelect = this.inventoryitemstatusService
      .InventoryItemStatusSelect(status)
      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.partsSelect = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(partSelect);
  }

  getChassisData(): void {
    const subscription = this.bigpartsService.GetChasisData().subscribe(
      (res: any) => {
        this.updateTable(this.columnNames, res);
        this.datasourceFilter = res;
      },
      (error) => {
        this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
      }
    );
    this.subscribedService.push(subscription);
  }

  bigPartsOtherData(val: string): void {
    // Filter OtherDataList based on the value of `val`
    const filteredData = this.OtherDataList.filter((item: any) =>
      Object.values(item).some((field: any) =>
        field?.toString().toLowerCase().includes(val.toLowerCase())
      )
    );

    // Update the table with filtered data
    this.updateTable(this.columnNames, filteredData);
  }
  updateTable(columns: any[], data: any[]): void {
    // Clear columns and data first
    this.displayedColumns = [];
    this.dataSource.data = [];
    this.dataSourceSearch = [];
    this.cd.detectChanges(); // Trigger change detection to ensure the table is cleared

    // Update columns and data
    this.displayedColumns = columns.map((col) => col.columnDef);
    this.displayedExcelColumns = columns.map((col) => col.header);
    this.dataSourceSearch = data;
    this.dataSource.data = data || [];
    this.cd.detectChanges(); // Trigger change detection to reflect the updates
    this.dataSource.sort = this.sort;
  }

  filterData(): void {
    const { fromDate, toDate, siteId, statusId, ItemStatus, searchTab } =
      this.bigparts.value;
    // Check if fromDate is selected but toDate is missing
    if (fromDate && !toDate) {
      this.toastr.warning('Please Select To Date', 'WARNING');
      return;
    }
    this.dataSource.data = this.dataSourceSearch.filter((item) => {
      const matchesDateRange =
        (!fromDate ||
          (item.EstArrivalDate &&
            new Date(item.EstArrivalDate) >= new Date(fromDate))) &&
        (!toDate ||
          (item.EstArrivalDate &&
            new Date(item.EstArrivalDate) <= new Date(toDate)));

      const matchesSite = !siteId || siteId === '0' || item.Site === siteId;

      const matchesStatus =
        this.activeValue === 'Chassis'
          ? !statusId || statusId === '0' || item.ChassisStatus === statusId
          : !ItemStatus ||
            ItemStatus === '0' ||
            item.InventoryStatus === ItemStatus;

      const matchesSearch =
        !searchTab ||
        Object.values(item)
          .filter((val) => val != null) // Avoid checking null or undefined values
          .some((val) =>
            val.toString().toLowerCase().includes(searchTab.toLowerCase())
          );

      return matchesDateRange && matchesSite && matchesStatus && matchesSearch;
    });
  }
  //Search bar
  doFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getChasisStatus() {
    const status: Chasis = {
      ChassisStatusId: 0,
      TenantId: 1,
    };
    const colorSelectService = this.bigpartsService
      .GetChasisStatusData(status)
      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.chasisStatusSelect = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(colorSelectService);
  }

  getPartList() {
    const bigpartsitemData: Bigpartsitem = {
      ItemId: 0,
    };

    const getData = this.itemMasterService
      .getBigPartsItem(bigpartsitemData)

      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.partsListAx = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(getData);
  }

  getSiteList() {
    const site: Site = {
      siteId: 0,
      tenantId: 1,
    };
    const colorSelectService = this.bigpartsService.GetSiteList(site).subscribe(
      (res: any) => {
        if (res != null && res.length > 0) {
          this.SiteList = res;
        }
      },
      (error) => {
        this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
      }
    );
    this.subscribedService.push(colorSelectService);
  }

  getBigPartsOtherData() {
    const subscription = this.bigpartsService
      .GetOtherBigItemsListFromAx()
      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.OtherDataList = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(subscription);
  }

  setActiveIndex(index: number, val: string): void {
    this.activeIndex = index;
    this.activeValue = val;
    if (val === 'Chassis') {
      // Update columnNames and fetch Chassis data
      this.columnNames = [
        { columnDef: 'SalesId', header: 'Sales ID' },
        { columnDef: 'ProdId', header: 'Prod ID' },
        { columnDef: 'ChassisVin', header: 'Chassis VIN' },
        { columnDef: 'DaysOnSite', header: 'Days on site' },
        { columnDef: 'Site', header: 'Site' },
        { columnDef: 'EstArrivalDate', header: 'EST Arrival Date' },
        { columnDef: 'ChassisStatus', header: 'Chassis Status' },
        { columnDef: 'ProductionPool', header: 'Production Pool​' },
      ];
      this.getChassisData();
    } else {
      // Update columnNames and fetch Other Parts data
      this.columnNames = [
        { columnDef: 'SalesId', header: 'Sales ID' },
        { columnDef: 'ProdId', header: 'Prod ID' },
        { columnDef: 'ItemId', header: 'Item ID' },
        { columnDef: 'Quantity', header: 'Quantity' },
        { columnDef: 'Site', header: 'Site' },
        { columnDef: 'InventoryStatus', header: 'Parts Status' },
        { columnDef: 'ProductionPool', header: 'Production Pool​' },
        //  { columnDef: 'RawMaterial', header: 'Raw Material' },
      ];
      this.bigPartsOtherData(val);
    }
  }

  exportToExcel() {
    const currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );
    this.dataForExcel = [];

    // Filter out the "actions" column if present
    const exportableColumns = this.displayedExcelColumns;

    this.dataSource.filteredData.forEach((row: any) => {
      const formatDate = (dateStr: any): string => {
        if (!dateStr || dateStr === 'Invalid Date') return ''; // Handle null, undefined, or invalid dates

        if (dateStr instanceof Date) {
          return this.datepipe.transform(dateStr, 'MM/dd/yyyy', 'en-US') || '';
        }

        if (typeof dateStr === 'string') {
          const parts = dateStr.split('-'); // Assuming input format is "dd-MM-yyyy"
          if (parts.length !== 3) return ''; // Ensure valid date format

          const [day, month, year] = parts.map(Number); // Convert to numbers
          if (isNaN(day) || isNaN(month) || isNaN(year)) return ''; // Avoid NaN errors

          const dateObj = new Date(year, month - 1, day); // Create Date object (month is 0-based)
          if (isNaN(dateObj.getTime())) return ''; // Check for invalid date

          return this.datepipe.transform(dateObj, 'MM/dd/yyyy', 'en-US') || ''; // Format for Excel
        }

        return ''; // Return empty if format is unknown
      };

      const excelData: any = {};

      exportableColumns.forEach((column) => {
        switch (column) {
          case 'Sales ID':
            excelData['Sales Id'] = row.SalesId ? row.SalesId : '';
            break;
          case 'Prod ID':
            excelData['ProdId'] = row.ProdId ? row.ProdId : '';
            break;

          case 'Item ID':
            excelData['ItemId'] = row.ItemId ? row.ItemId : '';
            break;

          case 'Quantity':
            excelData['Quantity'] = row.Quantity ? row.Quantity : '';
            break;

          case 'Chassis VIN':
            excelData['ChassisVin'] = row.ChassisVin ? row.ChassisVin : '';
            break;

          case 'Days on site':
            excelData['DaysOnSite'] = row.DaysOnSite ? row.DaysOnSite : '';
            break;

          case 'Site':
            excelData['Site'] = row.Site ? row.Site : '';
            break;

          case 'Parts Status':
            excelData['InventoryStatus'] = row.InventoryStatus
              ? row.InventoryStatus
              : '';
            break;

          case 'EST Arrival Date':
            excelData['EstArrivalDate'] = formatDate(row.EstArrivalDate)
              ? new Date(formatDate(row.EstArrivalDate))
              : '';
            break;

          case 'Chassis Status':
            excelData['ChassisStatus'] = row.ChassisStatus
              ? row.ChassisStatus
              : '';
            break;

          case 'Production Pool​':
            excelData['ProductionPool'] = row.ProductionPool
              ? row.ProductionPool
              : '';
            break;

          default:
            excelData[column] = row[column];
        }
      });

      this.dataForExcel.push(Object.values(excelData));
    });

    const excelDisplayColumns = exportableColumns.map((column) => {
      switch (column) {
        case 'ProdDeliveryDate':
          return 'Delivery Date(MM/DD/YYYY)';
        case 'sold_date':
          return 'Sold Date(MM/DD/YYYY)';
        case 'Requestedshipdate':
          return 'Requested Ship Date(MM/DD/YYYY)';
        case 'InvoiceDate':
          return 'Invoice Date(MM/DD/YYYY)';
        default:
          return column;
      }
    });

    const reportData = {
      image: 'assets/images/Fouts-Fire.png',
      title: 'Big-parts',
      data: this.dataForExcel,
      headers: excelDisplayColumns,
      excelfilename: 'Big-parts ' + currentDateTime,
      sheetname: 'Big-parts',
    };

    if (this.dataForExcel.length > 0) {
      this.exportExcelService.exportExcel(reportData);
    } else {
      this.toastr.error('No data to display');
    }
  }
  // Clear All filter
  clearFilter() {
    this.setActiveIndex(0, 'Chassis');
    this.bigparts.controls['fromDate'].setValue(null);
    this.bigparts.controls['toDate'].setValue(null);
    this.bigparts.controls['siteId'].setValue('0');
    this.bigparts.controls['statusId'].setValue('0');
    this.bigparts.controls['searchTab'].setValue('');
    this.bigparts.controls['toDate'].disable();
    let filteredData = this.dataSourcesearch;
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.data = this.dataSourceSearch;
  }
  // Validation of To Date enables after from Date is inserted
  updateMinToDate(selectedFromDate: Date): void {
    this.minToDate = selectedFromDate;
    this.bigparts.controls['toDate'].setValue(null);
    this.bigparts.controls['toDate'].enable();
  }
  //** Converting Date to MM/DD/YYYY format **//
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
}
