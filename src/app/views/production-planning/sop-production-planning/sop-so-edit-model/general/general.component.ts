import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import * as moment from 'moment';
import { DynamicTabsComponent } from '../dynamic-tabs/dynamic-tabs.component';
import { SopProductionPlanningComponent } from '../../sop-production-planning.component';
import { SopSoEditModelComponent } from '../sop-so-edit-model.component';
import { SiteService } from '../../../../../services/site.service';
import { HelperService } from '../../../../../services/helper.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { DataSharingService } from '../../../services/data-sharing.service';
import { SalesStatusService } from '../../../services/sales-status.service';
import { CategoryService } from '../../../services/category.service';
import { PrdStageService } from '../../../services/prd-stage.service';
import { TruckStatusService } from '../../../services/truck-status.service';
import { SubcategoryService } from '../../../services/subcategory.service';
import { DealerService } from '../../../services/dealer.service';
import { IProductionPlanGeneralInsertUpdate } from '../../../interfaces/production-sop';
import { SiteSelectEntity } from '../../../../../interfaces/siteentity';
import { TruckStatusSelectEntity } from '../../../interfaces/truck-status.interface';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicTabsComponent) dynamicTabsComponent: DynamicTabsComponent | undefined;
  @ViewChild(SopProductionPlanningComponent) sopParentComponent: SopProductionPlanningComponent | undefined;
  @ViewChild(SopSoEditModelComponent) sopEditModelComponent: SopSoEditModelComponent | undefined;
  @Input() commonTableData: any;

  // Arrays to store data from various services
  categoryList: any[] = [];
  subCategoryList: any[] = [];
  filterSubCategoryList: any[] = [];
  dealerList: any[] = [];
  siteList: any[] = [];
  prdList: any[] = [];
  statusList: any[] = [];
  loginInfo: any;
  subscription: Subscription[] = [];
  currentDeliveryDate:any;

  // Input property to receive general data
  @Input() generalData: any;
  @Input() soNumber: any;
  @Input() panView: any;
  
  // Form groups for AX and S&OP data
  axForm: FormGroup;
  sopForm: FormGroup;

  // Arrays to store specific data from generalData
  generalAXData: any[] = [];
  generalASandOPData: any[] = [];

  @Output() selectionChanged = new EventEmitter<any>();
  @Output() deliveryDateChanged = new EventEmitter<any>();
  @Output() subCategoryChanged = new EventEmitter<any>();
  salesStatusList: any[]=[];

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubcategoryService,
    private dealerService: DealerService,
    private siteService: SiteService,
    private prdService: PrdStageService,
    private statusService: TruckStatusService,
    private salesStatusService: SalesStatusService,
    private helper: HelperService,
    private fb: FormBuilder,
    private productionPlanService: ProductionPlanningService,
    private datePipe: DatePipe,
    private cdk:ChangeDetectorRef,
    private dataSharingS:DataSharingService,
    private toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['generalData']) {
      this.ngOnInit();
    }
  }

  async ngOnInit() {
    // Initialization logic on component creation

    // Extracting login information from the helper service
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));

    // Extracting AX and S&OP data from the input
    this.generalAXData = this.generalData[0].axData;
    //console.log(this.generalAXData,"ax")
    this.generalASandOPData = this.generalData[0].SANDOP;
    //console.log(this.generalASandOPData,"SANDOP")
    // Initializing form groups for AX and S&OP data
    this.axForm = this.fb.group({
      so: [this.soNumber], // Add default or initial values if needed
      category: [''],
      dealer: [''],
      deliveryDate: [''],
      site: [''],
      prdStage: [''],
      subCategory: [''],
      customer: [''],
      prdStartDate: [''],
      status: [''],
      soldDate: [''],
      chassisvin: ['']
    });
    this.sopForm = this.fb.group({
      soNumber: [this.soNumber], // Add default or initial values if needed
      categoryId: [null, Validators.required],
      dealerId: [null],
      deliveryDate: ['', Validators.required],
      pumpPreWireDate:[''],
      qcFinishDate:[''],
      prdLineFinishDate:[''],
      op10SubFrameStartDate:[''],
      site: [null, Validators.required],
      prdStageId: [0],
      salesStatusId: [0],
      subCategoryId: [null, Validators.required],
      customerName: [''],
      prdStartDate: [''],
      statusId: [null, Validators.required],
      soldDate: [''],
      chassisvin: [''],
      TenantId: this.loginInfo.TenantId,
      Createdby: this.loginInfo.UserId
    });

    // Disable AX form
    this.axForm.disable();
    
    // Fetch data from various services
    await this.getCategoryList();
    await this.getSubCategoryList();
    this.getDealerList();
    this.getSiteList();
    this.getSalesStatusData();
    this.getPRDList();
    this.getStatusList();

    // Bind data to forms if available
    if (this.generalASandOPData != null) {
      this.bindSandOPData();
      // this.sopForm.controls['soNumber'].disable();
    }
    if (this.generalAXData != null) {
      this.bindAXData();
    }

  }

  ngOnDestroy(): void {
    // Cleanup subscriptions to avoid memory leaks
    this.subscription.forEach((subscribe: any) => {
      subscribe.unsubscribe();
    });
  }

  // Function to bind AX data to form
  bindAXData() {
    this.axForm.patchValue({
      so:this.generalAXData[0]?.soNumber,
      category: this.generalAXData[0]?.categoryName,
      dealer: this.generalAXData[0]?.dealerName,
      subCategory: this.generalAXData[0]?.subCategoryName,
      customer: this.generalAXData[0]?.customerName,
      soldDate: this.ConvertDate(new Date(this.generalAXData[0]?.soldDate)),
      deliveryDate: this.ConvertDate(this.generalAXData[0]?.deliveryDate),
      site: this.generalAXData[0]?.site,
      status:this.generalAXData[0].statusName,
      chassisvin: this.generalAXData[0]?.vin,
      // Add other form controls if needed
    });
    this.sopForm.controls['soNumber'].setValue(this.generalAXData[0]?.soNumber);
    // this.sopForm.controls['customerName'].setValue(this.generalAXData[0]?.customerName);
    // this.sopForm.controls['so'].disable();
  }

  ConvertDate(date: any): string {
    if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return ''; // Return empty string if the date is invalid
      }
  
      const cdate = this.datePipe.transform(parsedDate, 'MM/dd/yy');
      if (cdate === '01/01/00' || cdate === '01/01/01' || cdate === null) {
        return '';
      } else {
        return cdate;
      }
    } else {
      return '';
    }
  }
  

  // Function to bind S&OP data to form
  bindSandOPData() {
    if(this.generalASandOPData[0]?.categoryId != undefined || this.generalASandOPData[0]?.categoryId != null){
      this.filterSubCategoryList = this.subCategoryList.filter((e:any)=> e.CategoryId == this.generalASandOPData[0]?.categoryId);
      this.cdk.detectChanges();
    }
    this.sopForm.patchValue({
      soNumber:this.soNumber,
      categoryId: this.generalASandOPData[0]?.categoryId,
      dealerId: this.generalASandOPData[0]?.dealerId,
      subCategoryId: this.generalASandOPData[0]?.subCategoryId,
      customerName: this.generalASandOPData[0]?.customerName,
      soldDate: this.ConvertDate(this.generalASandOPData[0]?.soldDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.soldDate)),
      statusId: this.generalASandOPData[0]?.statusId,
      deliveryDate: this.ConvertDate(this.generalASandOPData[0]?.deliveryDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.deliveryDate)),
      pumpPreWireDate: this.ConvertDate(this.generalASandOPData[0]?.pumpPreWireDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.pumpPreWireDate)),
      qcFinishDate: this.ConvertDate(this.generalASandOPData[0]?.qcFinishDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.qcFinishDate)),
      op10SubFrameStartDate: this.ConvertDate(this.generalASandOPData[0]?.op10SubFrameStartDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.op10SubFrameStartDate)),
      prdLineFinishDate: this.ConvertDate(this.generalASandOPData[0]?.prdLineFinishDate) == '' ? '' :new Date(this.ConvertDate(this.generalASandOPData[0]?.prdLineFinishDate)),
      prdStartDate: this.ConvertDate(this.generalASandOPData[0]?.prdStartDate)== '' ? '' : new Date(this.ConvertDate(this.generalASandOPData[0]?.prdStartDate)),
      prdStageId: this.generalASandOPData[0]?.prdStageId,
      salesStatusId: this.generalASandOPData[0]?.salesStatusId,
      site: this.generalASandOPData[0]?.site ? Number(this.generalASandOPData[0]?.site) : null,
      chassisvin: this.generalASandOPData[0]?.vin != null? this.generalASandOPData[0]?.vin : "",
    });

    this.dataSharingS.setDeliveryDate(new Date(this.generalASandOPData[0]?.deliveryDate));
    this.deliveryDateChanged.emit(new Date(this.generalASandOPData[0]?.deliveryDate));
    
  }

  bindProdLT(subId:any){
    let prodLt = 0;
    if(subId){
      const selectedSubCat = this.subCategoryList.filter((e:any) => e.SubCategoryId == subId);
      prodLt = selectedSubCat[0]?.ProdLTDays;
    }
    //console.log(prodLt);
    this.subCategoryChanged.emit(prodLt);
    
  }

  // Function to fetch Category list
  async getCategoryList() {
    let data = {
      CategoryId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const categoryService = this.categoryService.GetCategory(data).subscribe((res: any) => {
      //console.log(res);
      this.categoryList = res;
    });
    this.subscription.push(categoryService);
  }

  // Function to fetch SubCategory list
  async getSubCategoryList() {
    let data = {
      SubCategoryId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const subCategoryService = await this.subCategoryService.GetSubcategory(data).subscribe((res: any) => {
      //console.log(res);
      this.subCategoryList = res;
      this.filterSubCategoryList = this.subCategoryList.filter((e:any)=> e.CategoryId == this.generalASandOPData[0]?.categoryId);
      this.bindProdLT(this.generalASandOPData[0]?.subCategoryId)
    });
    this.subscription.push(subCategoryService);
  }

  // Function to fetch Dealer list
  getDealerList() {
    let data = {
      DealerId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const dealerService = this.dealerService.GetDealer(data).subscribe((res: any) => {
      //console.log(res);
      this.dealerList = res;
    });
    this.subscription.push(dealerService);
  }

  // Function to fetch Site list
  getSiteList() {
    let data: SiteSelectEntity= {
      SiteId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const siteService = this.siteService.getSite(data).subscribe((res: any) => {
      //console.log(res);
      this.siteList = res;
    });
    this.subscription.push(siteService);
  }

  getSalesStatusData() {
    const salesStatusData: any = {
      salesStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const salesStatusGetService = this.salesStatusService.getSalesStatus(salesStatusData)
      .subscribe((res: any) => {
        if (!res[0].Message) {
            this.salesStatusList = res;
        }
        else {
        
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
  }

  // Function to fetch PRD list
  getPRDList() {
    let data = {
      PRDStageId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const prdService = this.prdService.getPrd(data).subscribe((res: any) => {
      //console.log(res);
      this.prdList = res;
    });
    this.subscription.push(prdService);
  }

  // Function to fetch Status list
  getStatusList() {
    let data:TruckStatusSelectEntity  = {
      TruckStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    };

    const statusService = this.statusService.GetTruck(data).subscribe((res: any) => {
      //console.log(res);
      this.statusList = res;
    });

    this.subscription.push(statusService);
  }

  // Function to copy data from AX to S&OP form
  copyToRight() {
    if(this.generalAXData[0]?.categoryId != undefined || this.generalASandOPData[0]?.categoryId != null){
      this.filterSubCategoryList = this.subCategoryList.filter((e:any)=> e.CategoryId == this.generalAXData[0]?.categoryId);
      this.cdk.detectChanges();
    }
    this.sopForm.patchValue({
      soNumber: this.generalAXData[0]?.soNumber,
      categoryId: this.generalAXData[0]?.categoryId,
      dealerId: this.generalAXData[0]?.dealerId,
      subCategoryId: this.generalAXData[0]?.subCategoryId,
      customerName: this.generalAXData[0]?.customerName,
      soldDate: this.generalAXData[0]?.soldDate == '' ? '' :this.ConvertDate(this.generalAXData[0]?.soldDate) == '' ? '' : new Date(this.ConvertDate(this.generalAXData[0]?.soldDate)),
      deliveryDate: this.generalAXData[0]?.deliveryDate == '' ? '' :this.ConvertDate(this.generalAXData[0]?.deliveryDate) == '' ? '' : new Date(this.ConvertDate(this.generalAXData[0]?.deliveryDate)),
      site: this.generalAXData[0]?.siteId,
      statusId:this.generalAXData[0].StatusId,
      chassisvin: this.generalAXData[0]?.vin,
    });
    this.bindProdLT(this.generalAXData[0]?.subCategoryId);
  }

  // Function to save general data
  saveGeneralData() {

    if(this.sopForm.invalid){
      this.toastr.error("Please fill all the mandatory field","WARNING");
      this.sopForm.markAllAsTouched();
      return;
    }
    
      let data:IProductionPlanGeneralInsertUpdate = {
        soNumber: this.sopForm.value.soNumber,
        categoryId: this.sopForm.value.categoryId,
        subcategoryId: this.sopForm.value.subCategoryId,
        customerName: this.sopForm.value.customerName,
        dealerId: this.sopForm.value.dealerId,
        prdStartDate: this.datePipe.transform(this.sopForm.value.prdStartDate,"dd-MMM-yyyy") ?this.datePipe.transform(this.sopForm.value.prdStartDate,"dd-MMM-yyyy") : "" ,
        deliveryDate: this.datePipe.transform(this.sopForm.value.deliveryDate,"dd-MMM-yyyy"),
        qcFinishDate: this.datePipe.transform(this.sopForm.value.qcFinishDate,"dd-MMM-yyyy"),
        pumpPreWireDate: this.datePipe.transform(this.sopForm.value.pumpPreWireDate,"dd-MMM-yyyy"),
        op10SubFrameStartDate: this.datePipe.transform(this.sopForm.value.op10SubFrameStartDate,"dd-MMM-yyyy"),
        prdLineFinishDate: this.datePipe.transform(this.sopForm.value.prdLineFinishDate,"dd-MMM-yyyy"),
        statusId: this.sopForm.value.statusId,
        site: this.sopForm.value.site,
        salesStatusId: this.sopForm.value.salesStatusId,
        soldDate: this.datePipe.transform(this.sopForm.value.soldDate,"dd-MMM-yyyy")? this.datePipe.transform(this.sopForm.value.soldDate,"dd-MMM-yyyy"):'',
        prdStageId: this.sopForm.value.prdStageId,
        tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
        chassisvin:this.sopForm.value.chassisvin ? this.sopForm.value.chassisvin : ""
      }
  
      try {
        this.productionPlanService.productionPlanningGeneralInsertUpdate(data).subscribe((res: any) => {
          //console.log(res, 'General save response');
          if (res[0].SuccessMessage) {
            this.toastr.success(res[0].SuccessMessage, "Success");
            this.dataSharingS.setDeliveryDate(new Date(this.sopForm.value.deliveryDate));
            this.deliveryDateChanged.emit(this.sopForm.value.deliveryDate);
            if(this.sopParentComponent){
              this.sopParentComponent.getSOPData();
              this.sopEditModelComponent.finalSopData = this.sopParentComponent.finalSopData;
            }
            if(this.dynamicTabsComponent){
              this.dynamicTabsComponent.calculateRLT();
            }
          }
          if (res[0].ErrorMessage) {
            this.toastr.error(res[0].ErrorMessage, "Error");
          }
        });
      } catch (error) {
        this.toastr.error(error.message);
      }
  }

  onCategorySelectionChange(event:any){
    let value = event.value;
    this.filterSubCategoryList = this.subCategoryList.filter((item:any) => item.CategoryId == value )
  }

  getProductionLT(item:any){
    //console.log(item);
    let prodLT = item.ProdLTDays;
    this.subCategoryChanged.emit(prodLT);
  }

  cancelData(){
    if (this.generalASandOPData != null) {
      this.bindSandOPData();
      // this.sopForm.controls['soNumber'].disable();
    }
  }

  clearSelect(field:any){
    if(field == 'dealer'){
      this.sopForm.controls['dealerId'].setValue(null);
    }
    if(field == 'prd'){
      this.sopForm.controls['prdStageId'].setValue(null);
    }
    if(field == 'salesStatus'){
      this.sopForm.controls['salesStatusId'].setValue(0);
    }
  }

  checkView(){
    if(this.panView){
      return 'col-xl-6 col-lg-6';
    }else{
      return 'col-xl-6 col-lg-6'
    }
  }

  checkCategory(categoryId:any){
    console.log(categoryId);
    
    if(categoryId){
      return;
    }else{
      this.toastr.warning("Please select category.", "WARNING");
    }
  }
}
