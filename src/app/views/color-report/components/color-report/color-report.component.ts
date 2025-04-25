import {
  ChangeDetectorRef,
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SiteService } from '../../../../services/site.service';
import { AxProdStatusService } from '../../../../services/ax-prod-status.service';
import { ColorreportService } from '../../services/colorreport.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { AxprodStatusSelectEntity } from '../../../../interfaces/ax-prod-status-entity';
import { SiteSelectEntity } from '../../../../interfaces/siteentity';
import { ColorreportviewComponent } from '../colorreportview/colorreportview.component';
import { ConvertDatePipe } from '../../../../shared/pipes/convert-date.pipe';

@Component({
  selector: 'app-color-report',
  templateUrl: './color-report.component.html',
  styleUrl: './color-report.component.scss',
  providers: [ConvertDatePipe],
})
export class ColorReportComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  loginInfo: any;
  activeIndex: number = 0;
  frmColorReport!: FormGroup;
  allSiteMaster: any[] = [];
  allBusinessMaster: any[] = [];
  public dataSourcesearch: any[] = [];
  subscribedService: Subscription[] = [];
  dataSource = new MatTableDataSource<any>([]);
  dataForExcel: any[] | undefined;
  minToDate: string | null | any = null;
  menuData: any;
  menuAccess: any;
  allProductionStatusData: any[] = [];
  displayedColumns: string[] = [];

  columns: any[] = [
    { columnDef: 'prodStatus', header: 'Status' },
    { columnDef: 'customerName', header: 'Customer' },
    { columnDef: 'salesResponsible', header: 'Sales Responsible' },
    { columnDef: 'soDeliveryDate', header: 'Sales Order Delivery Date' },
    { columnDef: 'prodDeliveryDate', header: 'PROD Delivery Date' },
    { columnDef: 'prodStartDate', header: 'PROD Start Date' },
    { columnDef: 'color', header: 'Color Code' },
    { columnDef: 'chassisStatus', header: 'Chassis Status' },
    {
      columnDef: 'ProductionPool',
      header: 'Production Pool',
    },
    {
      columnDef: 'resourceGroup',
      header: 'Resource Group',
    },
    {
      columnDef: 'businessUnit',
      header: 'Business Unit',
    },
    {
      columnDef: 'estimatedChassisArrivalDate',
      header: 'Chassis Arrival Date',
    },
    { columnDef: 'lastOperation', header: 'Last Completed Operation' },
    { columnDef: 'estimatedHours', header: 'Estimated Hours' },
    { columnDef: 'numDays', header: 'Delivery Difference' },
    { columnDef: 'reportedHours', header: 'Actual Hours' },
    { columnDef: 'totalSalesLineAmount', header: 'Sales Amount ($)' },
    { columnDef: 'operation20TruckInstallHours', header: 'OP_20_Hours' },
    { columnDef: 'none', header: 'None' },
    { columnDef: 'serialized', header: 'Serial' },
    { columnDef: 'salesId', header: 'Sales Id' },
    { columnDef: 'prodId', header: 'Prod Id' },
    { columnDef: 'configuration', header: 'Configuration' },
    { columnDef: 'vin', header: 'Chassis VIN' },
    { columnDef: 'site', header: 'Site' },
    { columnDef: 'shippingDateRequested', header: 'Requested Delivery Date' },

    { columnDef: 'bom', header: 'BOM' },
  ];

  constructor(
    private dialog: MatDialog,
    private helper: HelperService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private colorService: ColorreportService,

    public datepipe: DatePipe,
    private router: Router,
    private cd: ChangeDetectorRef,
    private siteService: SiteService,
    private excelService: ExportExcelService,
    private productionstatusService: AxProdStatusService
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
    this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '{}');

    this.frmColorReport = this.formBuilder.group({
      fromDate: [null],
      toDate: [null],
      siteId: [0],
      statusId: [0],
      searchTab: [''],
    });
    this.frmColorReport.controls['toDate'].disable();
    this.displayedColumns = this.columns.map((col) => col.columnDef);
    this.getProductionStatusData();
    this.getSiteData();
    this.getColorReportData();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  setMenuAccess() {
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
  }

  getProductionStatusData() {
    let psData: AxprodStatusSelectEntity = {
      axProdStatusId: 0,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const truckSelectService = this.productionstatusService
      .GetAxprodSatus(psData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            this.allProductionStatusData = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(truckSelectService);
  }

  getSiteData() {
    const siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const siteSelectService = this.siteService.getSite(siteData).subscribe(
      (res: any) => {
        if (!res[0].Message) {
          this.allSiteMaster = res;
        }
      },
      (error) => {
        this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
      }
    );
    this.subscribedService.push(siteSelectService);
  }

  getColorReportData() {
    const colorSelectService = this.colorService
      .GetcolorReportParamAsync()
      .subscribe(
        (res: any) => {
          if (res != null && res.length > 0) {
            this.dataSourcesearch = res;
            this.dataSource.data = res;
            this.dataSource.paginator = this.paginator;
            this.cd.detectChanges();
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(colorSelectService);
  }

  filterData() {
    let fromdate = this.datepipe.transform(
      this.frmColorReport.controls['fromDate'].value,
      'yyyy-MM-dd'
    );
    let todate = this.datepipe.transform(
      this.frmColorReport.controls['toDate'].value,
      'yyyy-MM-dd'
    );
    let site =
      this.frmColorReport.controls['siteId'].value == 0
        ? null
        : this.frmColorReport.controls['siteId'].value;
    let statusId =
      this.frmColorReport.controls['statusId'].value == 0
        ? null
        : this.frmColorReport.controls['statusId'].value;
    this.frmColorReport.controls['searchTab'].setValue('');

    if (this.frmColorReport.controls['fromDate'].value) {
      if (!this.frmColorReport.controls['toDate'].value) {
        this.toastr.warning('Please Select To Date', 'WARNING');
      }
    }

    if (
      this.frmColorReport.controls['fromDate'].value &&
      this.frmColorReport.controls['toDate'].value
    ) {
      let selectedMembers = this.dataSourcesearch.filter(
        (f: any) =>
          this.datepipe.transform(f.prodDeliveryDate, 'yyyy-MM-dd') >=
            fromdate &&
          this.datepipe.transform(f.prodDeliveryDate, 'yyyy-MM-dd') <= todate
      );

      if (site != null) {
        selectedMembers = selectedMembers.filter(
          (f: { site: string }) => f.site?.toLowerCase() == site.toLowerCase()
        );
      }

      if (statusId != null) {
        selectedMembers = selectedMembers.filter(
          (f: { prodStatus: string }) =>
            f.prodStatus?.toLowerCase() == statusId?.toLowerCase()
        );
      }

      this.dataSource = new MatTableDataSource(selectedMembers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      // Apply filter for status and site even if the date is not selected
      let selectedMembers = this.dataSourcesearch;

      if (site != null) {
        selectedMembers = selectedMembers.filter(
          (f: { site: string }) => f.site?.toLowerCase() == site.toLowerCase()
        );
      }

      if (statusId != null) {
        selectedMembers = selectedMembers.filter(
          (f: { prodStatus: string }) =>
            f.prodStatus?.toLowerCase() == statusId?.toLowerCase()
        );
      }

      this.dataSource = new MatTableDataSource(selectedMembers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource = new MatTableDataSource(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  exportToExcel() {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );
    this.dataForExcel = [];

    // Ensure headers match correctly
    let exceldisplayColumns = this.columns.map((column) => {
      if (
        [
          'Sales Order Delivery Date',
          'Requested Delivery Date',
          'PROD Delivery Date',
          'PROD Start Date',
          'Chassis Arrival Date',
        ].includes(column.header)
      ) {
        return column.header + '(MM/DD/YY)'; // Ensure consistent formatting
      }
      return column.header;
    });

    this.dataSource.filteredData.forEach((row: any) => {
      let exceldata = {
        ['Sales Id']: row.salesId,
        ['Prod Id']: row.prodId,
        ['Configuration']: row.configuration,
        ['Status']: row.prodStatus,
        ['Customer']: row.customerName,
        ['Sales Responsible']: row.salesResponsible,
        ['Site']: row.site,
        ['Business Unit']: row.businessUnit,
        ['Production Pool']: row.prodPoolId,
        ['Resource Group']: row.resourceGroup,

        ['PROD Start Date(MM/DD/YY)']: ['01/01/00', '01/01/01'].includes(
          this.datepipe.transform(row.prodStartDate, 'MM/dd/yy')
        )
          ? null
          : this.datepipe.transform(row.prodStartDate, 'MM/dd/yy'),
        ['Requested Delivery Date(MM/DD/YY)']: [
          '01/01/00',
          '01/01/01',
        ].includes(
          this.datepipe.transform(row.shippingDateRequested, 'MM/dd/yy')
        )
          ? null
          : this.datepipe.transform(row.shippingDateRequested, 'MM/dd/yy'),
        ['Sales Order Delivery Date(MM/DD/YY)']: [
          '01/01/00',
          '01/01/01',
        ].includes(this.datepipe.transform(row.soDeliveryDate, 'MM/dd/yy'))
          ? null
          : this.datepipe.transform(row.soDeliveryDate, 'MM/dd/yy'),
        ['PROD Delivery Date(MM/DD/YY)']: ['01/01/00', '01/01/01'].includes(
          this.datepipe.transform(row.prodDeliveryDate, 'MM/dd/yy')
        )
          ? null
          : this.datepipe.transform(row.prodDeliveryDate, 'MM/dd/yy'),
        ['Chassis Arrival Date(MM/DD/YY)']: ['01/01/00', '01/01/01'].includes(
          this.datepipe.transform(row.estimatedChassisArrivalDate, 'MM/dd/yy')
        )
          ? null
          : this.datepipe.transform(
              row.estimatedChassisArrivalDate,
              'MM/dd/yy'
            ),
        ['Delivery Difference']: row.numDays,
        ['Color Code']: row.color,
        ['Chassis Status']: row.chassisStatus,
        ['Chassis VIN']: row.vin,
        ['Last Completed Operation']: row.lastOperation,
        ['Estimated Hours']: row.estimatedHours,
        ['Actual Hours']: row.reportedHours,
        ['Sales Amount ($)']: row.totalSalesLineAmount,
        ['OP_20_Hours']: row.operation20TruckInstallHours,
        None: row.none,
        ['Serial']: row.serialized,
      };

      // Ensure all values match headers correctly
      let rowValues = exceldisplayColumns.map(
        (column) => exceldata[column] ?? ''
      );

      this.dataForExcel.push(rowValues);
    });

    let reportData = {
      image: 'assets/images/Fouts-Fire.png',
      title: 'Color Report',
      data: this.dataForExcel,
      headers: exceldisplayColumns,
      excelfilename: 'Color Report ' + currentDateTime,
      sheetname: 'ColorReport',
    };

    if (this.dataForExcel.length > 0) {
      this.excelService.exportExcel(reportData);
    } else {
      this.toastr.error('No data to display');
    }
  }

  onBomInvoice(element: any) {
    const dialogRef = this.dialog.open(ColorreportviewComponent, {
      width: '80vw', // Adjust the width as needed
      height: '80%',
      data: {
        prodId: element.prodId,
        prodStartDate: element.prodStartDate,
        prodDeliveryDate: element.prodDeliveryDate,
        title: 'BOM',
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  clearfilters() {
    this.frmColorReport.controls['fromDate'].setValue(null);
    this.frmColorReport.controls['toDate'].setValue(null);
    this.frmColorReport.controls['siteId'].setValue('');
    this.frmColorReport.controls['statusId'].setValue(0);
    this.frmColorReport.controls['toDate'].disable();
    this.frmColorReport.controls['searchTab'].setValue('');
    this.dataSource.filter = '';
    this.dataSource.data = this.dataSourcesearch;
  }
  //** SEarch bar filter */
  doFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  // Date Validation like select only after fromDate is selected
  updateMinToDate(selectedFromDate: Date): void {
    this.minToDate = selectedFromDate;
    this.frmColorReport.controls['toDate'].enable();
    this.frmColorReport.controls['toDate'].setValue(null);
  }

  onFromDateChange() {
    let fromDateValue = this.frmColorReport.get('fromDate')?.value;

    if (fromDateValue) {
      // Convert the date format to MM/dd/yyyy
      let formattedDate = this.datepipe.transform(fromDateValue, 'MM/dd/yyyy');

      if (formattedDate) {
        this.frmColorReport.get('fromDate')?.setValue(formattedDate);
      }

      this.minToDate = fromDateValue;
      this.frmColorReport.controls['toDate'].enable();
      this.frmColorReport.controls['toDate'].setValue(null);

      const toDateControl = this.frmColorReport.get('toDate');
      if (toDateControl?.value && toDateControl.value < this.minToDate) {
        toDateControl.setValue('');
      }
    } else {
      this.minToDate = null;
    }
  }

  isDateColumn(columnName: string): boolean {
    return [
      'estimatedChassisArrivalDate',
      'prodDeliveryDate',
      'prodStartDate',
      'soDeliveryDate',
      'shippingDateRequested',
    ].includes(columnName);
  }
}
