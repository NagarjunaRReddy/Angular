import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { SpecReviewViewComponent } from './spec-review-view/spec-review-view.component';
import { Subscription } from 'rxjs';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { TruckStatusService } from '../production-planning/services/truck-status.service';
import { SiteService } from '../../services/site.service';
import { SpecreviewService } from '../production-planning/services/specreview.service';
import { ExportExcelService } from '../../services/export-excel.service';
import { TruckStatusSelectEntity } from '../production-planning/interfaces/truck-status.interface';
import { SiteSelectEntity } from '../../interfaces/siteentity';
import { SpecReviewBOMCOSelectEntity } from '../production-planning/interfaces/SpecReview-interface';

@Component({
  selector: 'app-spec-review',
  templateUrl: './spec-review.component.html',
  styleUrls: ['./spec-review.component.scss']
})
export class SpecReviewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  allStatusData: any[];
  loginInfo: any;
  activeIndex: number = 0;
  frmsales: FormGroup;
  allSiteData: any[] = [];
  columns: any;
  statusColumn: any[] = [
    'All',
    'Spec Review',
    'Bill Of Materials',
    'Change Order'
  ];
  subscribedService: Subscription[] = [];
  dataForExcel = [];
  public displayedColumns;
  public dataSource = new MatTableDataSource<any>();
  dataSourcesearch: any[] = [];
  action: string="All";
  minToDate: Date;
  datasourceFilter: any[]=[];
  menuData: any;
  menuAccess: any;

  constructor(
    private dialog: MatDialog,
    private helper: HelperService,
    private toastr: ToastrService,
    private statusService: TruckStatusService,
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private specService: SpecreviewService,
    private datepipe: DatePipe,
    private router:Router,
    private excelService: ExportExcelService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.menuData = JSON.parse(this.helper.getValue('leftMenu'));
    this.setMenuAccess();
    this.frmsales = this.formBuilder.group({
      // excelsheet:[''],
      fromDate: [null],
      toDate: [null],
      siteId: [0],
      statusId: [0],
      searchTab: ['']
    });
    this.frmsales.controls['toDate'].disable();
    this.getStatusData();
    this.getSiteData();
    this.dataSource.sort = this.sort;
    this.getTableData();
  }

  setMenuAccess(){
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e:any) => routerLink.includes(e.MenuPath))
    console.log(this.menuAccess);
    
    console.log(routerLink);
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach(element => {
      element.unsubscribe();
    });
  }

  getDisplayedColumns(action?: any) {
    switch (action) {
      case 'All':
        return [
          'SONumber',
          'CategoryName',
          'SubCategoryName',
          'DealerName',
          'Customername',
          'DeliveryDate',
          'Sold_Date',
          'site',
          'Status',
          'SpecReviewDate',
          'SpecreviewstatusName',
          'BOMDate',
          'BOMStatusName',
          'changeOrderdate',
          'CustomerOrderStatusName',
          'actions'
        ];
      case 'BOM':
        return [
          'SONumber',
          'CategoryName',
          'SubCategoryName',
          'DealerName',
          'Customername',
          'DeliveryDate',
          'Sold_Date',
          'site',
          'Status',
          'BOMDate',
          'BOMStatusName',
          'actions'
        ];
      case 'Spec Review':
        return [
          'SONumber',
          'CategoryName',
          'SubCategoryName',
          'DealerName',
          'Customername',
          'DeliveryDate',
          'Sold_Date',
          'site',
          'Status',
          'SpecReviewDate',
          'SpecreviewstatusName',
          'actions'
        ];
      case 'Change Order':
        return [
          'SONumber',
          'CategoryName',
          'SubCategoryName',
          'DealerName',
          'Customername',
          'DeliveryDate',
          'Sold_Date',
          'site',
          'Status',
          'changeOrderdate',
          'CustomerOrderStatusName',
          'actions'
        ];
      default:
        return [
          'SONumber',
          'CategoryName',
          'SubCategoryName',
          'DealerName',
          'Customername',
          'DeliveryDate',
          'Sold_Date',
          'site',
          'Status',
          'SpecReviewDate',
          'SpecreviewstatusName',
          'BOMDate',
          'BOMStatusName',
          'changeOrderdate',
          'CustomerOrderStatusName',
          'actions'
        ];
    }
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
  

  getTableData(action?: any) {
    this.displayedColumns = this.getDisplayedColumns(action);
    this.columns = [
      { field: 'DeliveryDate', header: 'Delivery Date' },
      { field: 'SONumber', header: 'SO' },
      { field: 'CategoryName', header: 'Category' },
      { field: 'SubCategoryName', header: 'Sub Category' },
      { field: 'DealerName', header: 'Dealer Name' },
      { field: 'Customername', header: 'End User' },
      { field: 'site', header: 'Site' },
      { field: 'Status', header: 'S&OP Truck Status' },
      { field: 'Sold_Date', header: 'Sold Date' },
      { field: 'SpecReviewDate', header: 'Spec Review Date' },
      { field: 'SpecreviewstatusName', header: 'Spec Review Status' },
      { field: 'BOMDate', header: 'BOM Date' },
      { field: 'BOMStatusName', header: 'BOM Status' },
      { field: 'changeOrderdate', header: 'Change Order Date' },
      { field: 'CustomerOrderStatusName', header: 'Change Order Status' },
      { field: 'actions', header: 'Action' }
    ];
    let specData: SpecReviewBOMCOSelectEntity = {
      SpecReviewBOMCOId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      Action: 'All'
    };
    const specSelectService = this.specService
      .SpecReviewBOMCOSelect(specData)
      .subscribe(
        (res: any) => {
          if (
            res != null &&
            res != undefined &&
            res.length > 0 &&
            !res[0].Message
          ) {
            const formattedData = res.map(item => {
              // Convert sold_date to the desired format
              const soldDate = this.ConvertDate(item.Sold_Date);
              // const formattedSoldDate = soldDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
            
              // Convert prodDeliveryDate to the desired format
              const DeliveryDate = this.ConvertDate(item.DeliveryDate);
              // const formattedProdDeliveryDate = prodDeliveryDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
             
              // Update the item with formatted dates
              return {
                ...item,
                Sold_Date: soldDate,
                DeliveryDate: DeliveryDate,
                BOMDate:this.ConvertDate(item.BOMDate),
                SpecReviewDate:this.ConvertDate(item.SpecReviewDate),
                changeOrderdate:this.ConvertDate(item.changeOrderdate),

              };
            });
          
            this.dataSource.data = res;
            this.dataSourcesearch = res;
            this.datasourceFilter = res;
            console.log(this.dataSource.data,"this.dataSource.data")
          }else{
            this.dataSourcesearch = [];
            this.datasourceFilter = [];
          }
        },
        error => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(specSelectService);
  }

  getStatusData() {
    let truckData: TruckStatusSelectEntity = {
      TruckStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const StatusSelectService = this.statusService
      .GetTruck(truckData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            this.allStatusData = res;
          }
        },
        error => {
          this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(StatusSelectService);
  }

  getSiteData() {
    let siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };
    const siteSelectService = this.siteService.getSite(siteData).subscribe(
      (res: any) => {
        if (!res[0].Message) {
          this.allSiteData = res;
        }
      },
      error => {
        this.toastr.error('Some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(siteSelectService);
  }

  viewSpec(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(SpecReviewViewComponent, {
      width: '80%', // Adjust the width as needed
      data: {
        title: this.action == "All"?'SPEC REVIEW, BOM & CO':this.action,
        //button: 'Save',
        view: true,
        value: row,
        action:this.action
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.getTableData();
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  }
  editSpec(row: any, event: Event) {
    event.stopPropagation();
    console.log();
    const dialogRef = this.dialog.open(SpecReviewViewComponent, {
      width: '80%', // Adjust the width as needed
      data: {
        title: this.action == "All"?'SPEC REVIEW, BOM & CO':this.action,
        button: 'Save',
        view: false,
        value: row,
        action: this.action
      },
      disableClose: true
    });

    dialogRef
      .afterClosed()
      .toPromise()
      .then(result => {
        if (result) {
          this.getTableData(this.action);
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });
  }
  setActiveStatus(index: number) {
    this.activeIndex = index;
    this.action = '';
    switch (this.activeIndex) {
      case 0:
        this.displayedColumns = this.getDisplayedColumns('All');
        // this.getTableData('All');
        this.action = 'All';

        break;
      case 1:
        this.displayedColumns = this.getDisplayedColumns('Spec Review');
        this.action = 'Spec Review';
        // this.getTableData('SpecReview');

        break;
      case 2:
        this.displayedColumns = this.getDisplayedColumns('BOM');
        this.action = 'BOM';
        // this.getTableData('BOM');
        break;
      case 3:
        this.displayedColumns = this.getDisplayedColumns('Change Order');
        this.action = 'Change Order';
        // this.getTableData('ChangeOrder');
        break;
      default:
        this.displayedColumns = this.getDisplayedColumns();
        break;
    }
  }

  getBackgroundColor(fields:string, row:any){
    if(fields == 'SpecreviewstatusName'){
      return row.specreviewcolorcode;
    }else if(fields == "BOMStatusName"){
      return row.bomcolorcode;
    }else if(fields == 'CustomerOrderStatusName'){
      return row.costatuscolorcode
    }else{
      return '';
    }
  }

  getColor(fields:string){
    if(fields == 'SpecreviewstatusName'){
      return "#FFFFFF";
    }else if(fields == "BOMStatusName"){
      return "#FFFFFF";
    }else if(fields == 'CustomerOrderStatusName'){
      return "#FFFFFF";
    }else{
      return '';
    }
  }

  exportToExcel() {
    let currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yy h:mm:ss'
    );
    
    this.dataForExcel = [];
    this.dataSource.filteredData.forEach((row: any) => {
      let delivery = this.datepipe.transform(row.DeliveryDate, 'MM/dd/yy');

      if (delivery != '01/01/00') {
        delivery = this.datepipe.transform(row.DeliveryDate, 'MM/dd/yy');
      }
      else {
        delivery = '';
      }
      let SoldDate = this.datepipe.transform(row.Sold_Date, 'MM/dd/yy');
      if (SoldDate != '01/01/00') {
        SoldDate = this.datepipe.transform(row.Sold_Date, 'MM/dd/yy');
      }else{
        SoldDate = '';
      }

      let exceldata = {
        SO: row.SONumber,
        // 'Business Unit': row.businessUnit,
        Category: row.CategoryName,
        'Sub Category': row.SubCategoryName,
        'Dealer Name': row.DealerName,
        'End User': row.Customername,
        'Delivery Date(DD/MM/YYYY)':delivery? new Date(delivery):'',
        'Sold Date(DD/MM/YYYY)':SoldDate? new Date(SoldDate):'',
        Site: row.site,
        ['S&OP Truck Status']: row.Status,
        'Spec Review Date(DD/MM/YYYY)':this.ConvertDate(row.SpecReviewDate)? new Date(row.SpecReviewDate):'',
        'Spec Review Name': row.SpecreviewstatusName,
        'Bom Date(DD/MM/YYYY)':this.ConvertDate(row.BOMDate)? new Date(row.BOMDate):'',
        'Bom Status': row.BOMStatusName,
        'Change Order Date(DD/MM/YYYY)':this.ConvertDate(row.changeOrderdate)? new Date(row.changeOrderdate):'',
        'Change Order Status': row.CustomerOrderStatusName
      };
      this.dataForExcel.push(Object.values(exceldata));
    });

    let exceldisplayColumns = [
      'SO',
      'Category',
      'Sub Category',
      'Dealer Name',
      'End User',
      'Delivery Date(DD/MM/YYYY)',
      'Sold Date(DD/MM/YYYY)',
      'Site',
      'S&OP Truck Status',
      'Spec Review Date(DD/MM/YYYY)',
      'Spec Review Name',
      'Bom Date(DD/MM/YYYY)',
      'Bom Status',
      'Change Order Date(DD/MM/YYYY)',
      'Change Order Status'
    ];

    let reportData = {
      image: 'assets/images/Fouts-Fire.png',
      title: this.action == "All"?'SpecReview BOM CO':this.action,
      data: this.dataForExcel,
      headers: exceldisplayColumns,
      excelfilename: 'SpecReviewBOMCO' + currentDateTime,
      sheetname: 'SpecReview BOM CO'
    };

    if (
      this.dataForExcel != undefined &&
      this.dataForExcel != null &&
      this.dataForExcel.length > 0
    )
      this.excelService.exportExcel(reportData);
    else this.toastr.error('No data to display');
  }

  filterData() {
    let fromdate = this.datepipe.transform(this.frmsales.controls['fromDate'].value, 'yyyy-MM-dd');
    let todate = this.datepipe.transform(this.frmsales.controls['toDate'].value, 'yyyy-MM-dd');
    let site = this.frmsales.controls['siteId'].value == 0 ? null : this.frmsales.controls['siteId'].value;
    let status = this.frmsales.controls['statusId'].value == 0 ? null : this.frmsales.controls['statusId'].value;

    if(fromdate){
      if(!todate){
        this.toastr.warning("Please select To Date", "WARNING")
      }
    }
  
    if (this.frmsales.controls['fromDate'].value && this.frmsales.controls['toDate'].value) {
      let selectedMembers = this.dataSourcesearch.filter(
        (f) =>
          this.datepipe.transform(f.DeliveryDate, 'yyyy-MM-dd') >= fromdate &&
          this.datepipe.transform(f.DeliveryDate, 'yyyy-MM-dd') <= todate
      );
  
      if (site != null) {
        selectedMembers = selectedMembers.filter((f) => f.site?.toLowerCase() == site.toLowerCase());
      }
  
      if (status != null) {
        selectedMembers = selectedMembers.filter((f) => f.StatusId == status);
      }
  
      this.dataSource = new MatTableDataSource(selectedMembers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else { // Apply filter for status and site even if the date is not selected
      let selectedMembers = this.dataSourcesearch;
  
      if (site != null) {
        selectedMembers = selectedMembers.filter((f) => f.site?.toLowerCase() == site.toLowerCase());
      }
  
      if (status != null) {
        selectedMembers = selectedMembers.filter((f) => f.StatusId == status);
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

  updateMinToDate(selectedFromDate: Date): void {
    // Set the minimum allowed date for "To Date" as the selected "From Date"
    this.minToDate = selectedFromDate;
    this.frmsales.controls['toDate'].enable();
    this.frmsales.controls['toDate'].setValue(null);
    // You can add additional logic if needed, such as setting a maximum date for "From Date"
  }

  ngAfterViewInit() {
    // Set sorting and pagination for the MatTable
    this.sort.active = 'DeliveryDate';
    this.sort.direction = 'asc';
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  
    // Explicitly run change detection after the initial setup
    this.cdr.detectChanges();
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
   console.log(this.dataSource,"this.dataSource")
    
  }

  clearfilters() {
    this.frmsales.controls['fromDate'].setValue(null);
    this.frmsales.controls['toDate'].setValue(null);
    this.frmsales.controls['siteId'].setValue(0);
    this.frmsales.controls['statusId'].setValue(0);
    this.frmsales.controls['toDate'].disable();
    // this.getSiteData();
    this.dataSource.data = this.datasourceFilter;
    this.getDisplayedColumns(this.action);
    this.dataSource.filter = '';
  }

  changeColor(status: any) {
    // const classes = {
    //   'closed': status === 'Maniyappa',
    //   'ready': status === 'Ready',
    //   'wip': status === 'WIP',
    //   'not_done': status === 'Not Done',
    //   'partially_closed': status === 'Partially Closed' || status === 'Partially completed',
    //   'default-color': true  // Default color class
    // };
    // console.log('Classes:', classes);
    if (status == 'Maniyappa') {
      return 'closed';
    }
    return '';
  }
}
