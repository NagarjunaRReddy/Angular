import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SiteSelectEntity } from '../../../../interfaces/siteentity';
import { SiteService } from '../../../../services/site.service';
import { Subscription } from 'rxjs';
import { SalesResposibleSelectEntity } from '../../../../interfaces/sales-resposible';
import { SalesResposibleService } from '../../../../services/sales-resposible.service';
import { AxprodStatusSelectEntity } from '../../../../interfaces/ax-prod-status-entity';
import { AxProdStatusService } from '../../../../services/ax-prod-status.service';
import { ProductionPoolSelectEntity } from '../../../../interfaces/production-pool';
import { ProductionPoolService } from '../../../../services/production-pool.service';
import { Router } from '@angular/router';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { SalesorderService } from '../../../../services/salesorder.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.scss',
})
export class SalesOrderComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscribedService: Subscription[] = [];

  allSiteMaster: any[] = [];
  allProductionStatusData: any[] = [
    {
      ProductionStatusId: 1,
      ProductionStatusName: 'Started',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:44:47.28',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 2,
      ProductionStatusName: 'Scheduled',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:44:53.903',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 3,
      ProductionStatusName: 'Released',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:45:07.977',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 4,
      ProductionStatusName: 'Estimated',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:45:19.65',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 5,
      ProductionStatusName: 'Created',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:45:26.413',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 6,
      ProductionStatusName: 'Ended',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:45:35.01',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 7,
      ProductionStatusName: 'Reported as finished',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-03-11T13:45:57.007',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
    {
      ProductionStatusId: 9,
      ProductionStatusName: 'Status',
      TenantId: 1,
      CreatedBy: 1,
      CreatedOn: '2024-11-25T10:13:51.813',
      ModifiedBy: null,
      ModifiedOn: null,
      IsDelete: 0,
    },
  ];
  minToDate!: Date;
  activeCategory: string = 'All';
  allStatusData: any[] = [];
  //activeIndex: any;
  activeLink: any;
  public dataSourcesearch: any[] = [];

  allCategoryList: any[] = [];

  frmsales!: FormGroup;
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
  displayedColumns: string[] = [];
  columnNames: string[] = [];
  data = [
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
    {
      BusinessUnit: 'FBFE',
      customerName: 'TIFT COUNTY BOARD OF COMMISSIONERS',
      ProdDeliveryDate: '1900-01-01T12:00:00',
      SONumber: 'SO-052588',
      Site: 'Milly',
      StatusId: 16,
      sold_date: '2024-11-28T00:00:00',
      CategoryName: 'Fouts FOUR',
      SubCategoryName: 'Darley Fouts FOUR',
      TruckStatusName: 'In Production',
      AXSalesorderstatus: 'Invoiced',
      InvoiceDate: '2023-02-02T12:00:00',
      soCreatedDate: '2020-10-08T17:36:09',
    },
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loadTable: boolean = false;
  allSalesResposible: any[] = [];
  href: string = '';
  filtersr: any[] = [];
  datasourceFilter: any[] = [];
  dataForExcel: any[];
  activeIndex: string = 'All';
  constructor(
    private formBuilder: FormBuilder,
    private siteService: SiteService,
    private salesResposibleService: SalesResposibleService,
    private axProdStatusService: AxProdStatusService,
    private productionPoolService: ProductionPoolService,
    private router: Router,
    private masterdetailsService: MasterdetailsService,
    private salesorderService: SalesorderService,
    private datepipe: DatePipe,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private exportExcelService: ExportExcelService
  ) { }

  ngOnInit(): void {
    const activeMenu = this.router.url.split('/');

    const title = activeMenu[activeMenu.length - 1];

    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);

    this.loadTable = true;
    this.getSiteData();
    this.getSalesResposible();
    //left hand side status
    this.getAxProductionStatus();
    //above table status - production pool
    this.getProductionPool();
    this.getColumns();
    // this.getSalesOrder();
    this.frmsales = this.formBuilder.group({
      // excelsheet:[''],
      fromDate: [null],
      toDate: [null],
      siteId: ['0'],
      statusId: ['0'], //sales resposible
      searchTab: [''],
    });

    this.frmsales.controls['toDate'].disable();
  }

  getProductionPool() {
    const productionPoolData: ProductionPoolSelectEntity = {
      productionPoolId: 0,
      tenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const productionPoolService = this.productionPoolService
      .GetProductionPool(productionPoolData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            // ax production status - left hand side
            this.allCategoryList = res;
            //this.
          }
        },
        (error) => {
          //this.toastr.error('Some Error Occured', 'ERROR');
        }
      );
    this.subscribedService.push(productionPoolService);
  }
  getAxProductionStatus() {
    const axprodData: AxprodStatusSelectEntity = {
      axProdStatusId: 0,
      tenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const axprodService = this.axProdStatusService
      .GetAxprodSatus(axprodData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            // ax production status - left hand side
            this.allStatusData = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(axprodService);
  }
  getSalesResposible() {
    const srData: SalesResposibleSelectEntity = {
      salesResposibleId: 0,
      tenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const siteGetService = this.salesResposibleService
      .GetSalesResposible(srData)
      .subscribe(
        (res: any) => {
          if (!res[0].Message) {
            this.allSalesResposible = res;
            this.filtersr = res;
          }
        },
        (error) => {
          this.toastr.error(`An error occurred: ${error.message}`, 'ERROR');
        }
      );
    this.subscribedService.push(siteGetService);
  }
  getSiteData() {
    const siteData: SiteSelectEntity = {
      SiteId: 0,
      TenantId: 1, // this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const siteGetService = this.siteService
      .getSite(siteData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
          this.allSiteMaster = res;
        }
      });
    this.subscribedService.push(siteGetService);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //** Search bar */
  doFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleSelectAll(event: any) {
    const isChecked = event.checked;
    this.dataSource.data.forEach((row: any) => (row.selected = isChecked));
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'SalesOrder',
      TenantId: 1, // Assuming static value or retrieve from loginInfo.TenantId
    };

    const axprodService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          console.log(res);

          if (!res[0]?.Message) {
            this.displayedColumns = res
              .filter((item: any) => item.DisplayName !== 'Sales status Name')
              .map((item: any) => item.DisplayName);
              console.log('displayedColumns',this.displayedColumns);



              
            //** Removed sales status name by filtering */
            this.columnNames = res
              .filter((item: any) => item.DisplayName !== 'Sales status Name')
              .map((item: any) => item.ColumnName);

              

            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }

            // Fetch data only after initializing columns
            this.getSalesOrder();
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(axprodService);
  }

  getSalesOrder() {
    this.salesorderService.getSalesOrderData().subscribe(
      (res: any) => {
        const mappedData = res.map((item: any) => {
          const soldDate = this.ConvertDate(item.sold_date);
          // Convert prodDeliveryDate to the desired format
          const prodDeliveryDate = this.ConvertDate(item.prodDeliveryDate);

          const requestedShipDate = this.ConvertDate(
            item.requestedShipDate
          );

          const requestedReceiptDate = this.ConvertDate(item.requestedReceiptDate);
          // const formattedProdDeliveryDate = prodDeliveryDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

          //const RAFDate = this.ConvertDate(item.RAFDate);
          // Update the item with formatted dates
          return {
            ...item,
            sold_date: soldDate,
            prodDeliveryDate: prodDeliveryDate,
            requestedShipDate: requestedShipDate,
            requestedReceiptDate: requestedReceiptDate,
            
           
          };
        });

        this.dataSource.data = mappedData;
        this.dataSourcesearch = mappedData;
        this.datasourceFilter = mappedData;
        this.dataSource.paginator = this.paginator;
        this.cd.detectChanges();
      },
      (error) => {
        console.error('Error fetching sales orders:', error);
      }
    );
  }

  parseDateString(dateStr: string | null): Date | null {
    if (!dateStr) return null;

    // Match "MM-dd-yyyy" format
    const mmddyyyy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (mmddyyyy) {
      return new Date(
        Number(mmddyyyy[3]), // Year
        Number(mmddyyyy[1]) - 1, // Month (0-based)
        Number(mmddyyyy[2]) // Day
      );
    }

    // Match "DD-MM-YYYY" format
    const ddmmyyyy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddmmyyyy) {
      return new Date(
        Number(ddmmyyyy[3]), // Year
        Number(ddmmyyyy[2]) - 1, // Month (0-based)
        Number(ddmmyyyy[1]) // Day
      );
    }

    // Try direct conversion
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  async filterData(index: any, link: any) {
    this.frmsales.controls['searchTab']?.setValue('');
    if (link !== '') this.activeLink = link;

    let fromDateStr = this.datepipe.transform(
      this.frmsales.controls['fromDate'].value,
      'MM-dd-yyyy'
    );
    let toDateStr = this.datepipe.transform(
      this.frmsales.controls['toDate'].value,
      'MM-dd-yyyy'
    );

    let fromDate = this.parseDateString(fromDateStr);
    let toDate = this.parseDateString(toDateStr);
    let site = this.frmsales.controls['siteId'].value || null;
    let status = this.frmsales.controls['statusId'].value || null;

    if (fromDate && !toDate) {
      this.toastr.warning('Please Select To Date', 'WARNING');
      return;
    }

    let filteredData = this.dataSourcesearch;

    if (fromDate && toDate) {
      filteredData = filteredData.filter((f) => {
        let rawDate = this.parseDateString(f.prodDeliveryDate);
        return rawDate && rawDate >= fromDate && rawDate <= toDate;
      });
    }

    if (site != '0') {
      filteredData = filteredData.filter(
        (f) => f.Site.toLowerCase() === site.toLowerCase()
      );
    }

    if (status != '0') {
      filteredData = filteredData.filter(
        (f) => f.SalesResponsible.toLowerCase() === status.toLowerCase()
      );
    }

    if (this.activeIndex !== 'All' && this.activeIndex !== null) {
      filteredData = filteredData.filter(
        (f) => f.ProdStatus === this.activeIndex
      );
    }

    if (this.activeCategory !== 'All') {
      filteredData = filteredData.filter(
        (f) => f['Production Pool'] === this.activeCategory
      );
    }

    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
    }
  }
  filtersalesresposible(event: Event) {
    let value = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.filtersr = this.allSalesResposible.filter((e: any) =>
      e['Sales Resposible'].toLowerCase().includes(value)
    );
  }

  clearfilters() {
    this.frmsales.controls['fromDate'].setValue(null);
    this.frmsales.controls['toDate'].setValue(null);
    this.frmsales.controls['siteId'].setValue('0');
    this.frmsales.controls['statusId'].setValue('0');
    this.frmsales.controls['toDate'].disable();
    this.dataSource.data = this.datasourceFilter;
    this.activeLink = 'All';
    this.activeIndex = 'All';
    this.activeCategory = 'All';
    // this.dataSource.filter = '';
    let filteredData = this.dataSourcesearch;
    this.frmsales.controls['searchTab'].setValue('');
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator ?? null;
  }

  exportToExcel()
 {
    const currentDateTime = this.datepipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );
    this.dataForExcel = [];

    // Filter out the "actions" column if present
    const exportableColumns = this.displayedColumns
      .filter((item: string) => item != 'Sales status Name')
      .map((item: string) =>
        ['site', 'prod Id'].includes(item) ? toTitleCase(item) : item
      );
    console.log(exportableColumns);

    function toTitleCase(str: string): string {
      return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

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
            excelData['SalesId'] = row.SalesId ? row.SalesId : '';
            break;
          case 'Site':
            excelData['Site'] = row.Site ? row.Site : '';
            break;
          case 'Customer Name':
            excelData['CustomerName'] = row.CustomerName
              ? row.CustomerName
              : '';
            break;
          case 'Business Unit':
            excelData['BusinessUnit'] = row['BusinessUnit']
              ? row['BusinessUnit']
              : '';
            break;
          case 'AX Prod Status':
            excelData['ProdStatus'] = row.ProdStatus ? row.ProdStatus : '';
            break;
          case 'Configuration':
            excelData['Configuration'] = row.Configuration
              ? row.Configuration
              : '';
            break;
          case 'Chassis VIN':
            excelData['VinNumber'] = row.VinNumber ? row.VinNumber : '';
            break;

          case 'Prod Delivery Date':
            excelData['ProdDeliveryDate'] = this.ConvertDate(
              row.ProdDeliveryDate
            );
            break;

          case 'Prod ID':
            excelData['ProdId'] = row.ProdId ? row.ProdId : '';
            break;

          case 'Requested Ship Date':
            excelData['RequestedShipDate'] = this.ConvertDate(
              row.RequestedShipDate
            );
            break;
          case 'Requested Receipt Date':
            excelData['RequestedReceiptDate'] = this.ConvertDate(
              row.RequestedReceiptDate
            );
            break;
          case 'Sales Status':
            excelData['SalesStatus'] = row.SalesStatus ? row.SalesStatus : '';
            break;
          case 'SO Creation Date and Time':
            excelData['SoCreatedDate'] = row.SoCreatedDate
              ? row.SoCreatedDate
              : '';
            break;
          case 'Sales Responsible':
            excelData['SalesResponsible'] = row.SalesResponsible
              ? row.SalesResponsible
              : '';
            break;
          case 'Chassis Make':
            excelData['Make'] = row.Make ? row.Make : '';
            break;
          case 'Chassis Model':
            excelData['Model'] = row.Model ? row.Model : '';
            break;
          case 'Model Year':
            excelData['ModelYear'] = row.ModelYear ? row.ModelYear : '';
            break;
          case 'Last Completed Operation':
            excelData['LastOperation'] = row.LastOperation
              ? row.LastOperation
              : '';
            break;
          case 'Lift Gate':
            excelData['LiftGate'] = row.LiftGate
              ? row.LiftGate
              : '';
            break;

          case 'WalkRamp':
            excelData['WalkRamp'] = row.WalkRamp
              ? row.WalkRamp
              : '';
            break;

            case 'Chassis Status':
              excelData['chassisstatus'] = row.chassisstatus
                ? row.chassisstatus
                : '';
              break;
              case 'Delivery Address':
                excelData['DeliveryAddress'] = row.DeliveryAddress
                  ? row.DeliveryAddress
                  : '';
                break;
                case 'Key Number':
                  excelData['KeyNumber'] = row.KeyNumber
                    ? row.KeyNumber
                    : '';
                  break;
                 
          case 'Chassis CA':
            excelData['ChassisCA'] = row.ChassisCA ? row.ChassisCA : '';
            break;

            case 'Invoice Date':
              excelData['InvoiceDate'] = this.ConvertDate(
                row.InvoiceDate
              );
              break;

             case 'RAF Date':
            excelData['RAFDate'] = row.RAFDate ? row.RAFDate : '';
            break;
             

          
          case 'Production Pool':
            excelData['Production Pool'] = row['Production Pool']
              ? row['Production Pool']
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
      title: 'Sales Order',
      data: this.dataForExcel,
      headers: excelDisplayColumns,
      excelfilename: 'Sales Order ' + currentDateTime,
      sheetname: 'SalesOrder',
    };

    if (this.dataForExcel.length > 0) {
      this.exportExcelService.exportExcel(reportData);
    } else {
      this.toastr.error('No data to display');
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

  setActiveIndex(index: string) {
    this.activeIndex = index;
    this.filterData(index, '');
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
    this.filterData('', category); // Call filterData after setting active category
  }
  // Date validation
  updateMinToDate(selectedFromDate: Date): void {
    this.minToDate = selectedFromDate;
    this.frmsales.controls['toDate'].setValue(null);
    this.frmsales.controls['toDate'].enable();
  }
}