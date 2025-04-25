// Import necessary modules and services
import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from '../../../../../services/helper.service';
import { DataSharingService } from '../../../services/data-sharing.service';
import { InventoryItemStatusService } from '../../../services/inventory-item-status.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { ItemService } from '../../../services/item.service';
import { InventoryItemStatusSelectEntity } from '../../../interfaces/inventory-item-status-interface';
import { ItemMasterSelectEntity } from '../../../interfaces/item-interface';
import { IProductionPlanDynamicInsertUpdate } from '../../../interfaces/production-sop';


@Component({
  selector: 'app-dynamic-tabs',
  templateUrl: './dynamic-tabs.component.html',
  styleUrls: ['./dynamic-tabs.component.scss'],
})
export class DynamicTabsComponent implements OnInit {
  // Input properties received from parent component
  @Input() commonTableData: any;
  @Input() soNumber: any;
  @Input() dynamicData: any;
  @Input() deliveryDateGeneral:any;
  @Input() flagSelected:any;
  @Input() selectedProdLT:any;
  @Input() panView: any;

  @Output() selectionChanged = new EventEmitter<{ tabId: string; colorCode: string }>();
  deliveryDate:any;

  // Form group for the dynamic form
  myForm: FormGroup;

  // User login information
  loginInfo: any;

  // Arrays to store item and inventory status lists
  itemList: any[] = [];
  inventoryList: any[] = [];

  // Constructor to inject services and modules
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private helper: HelperService,
    private itemService: ItemService,
    private dataShareService:DataSharingService,
    private inventoryStatusService: InventoryItemStatusService,
    private productionService: ProductionPlanningService,
    private toastr: ToastrService,
    private cd:ChangeDetectorRef
  ) {
    this.dataShareService.setSoListAXEdit(0);
    this.dataShareService.setSoListSOPEdit(0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['selectedProdLT'] && !changes['selectedProdLT'].firstChange) {
      // Call your function here
      this.calculateRLT();
    }

    if (changes['deliveryDateGeneral'] && !changes['deliveryDateGeneral'].firstChange) {
      // Call your function here
      this.calculateRLT();
    }
      //console.log(changes);
      
      if (changes['selectedProdLT']) {
        this.ngOnInit();
        this.ngAfterViewInit();
      }
    
   
  }

  // Lifecycle hook - OnInit
  async ngOnInit() {
    // Log dynamic data for debugging
    //console.log(this.dynamicData, 'Dynamic Data');

    // Parse user login information
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));

    // Initialize the form
    this.initForm();

    // Retrieve item and inventory status lists
    this.getItemList();
    await this.getInventoryStatusList();
    this.getDeliveryDate();

  }

  ngAfterViewInit(): void {
    // Bind S&OP data if available
    if (this.dynamicData.SandOPDetails != null || this.dynamicData.SandOPDetails != undefined) {
      this.bindSopData(this.dynamicData.SandOPDetails[0]);
    }
    this.calculateRLT();
    this.cd.detectChanges();
  }

  onSelectionChange(event: any): void {
    // Emit the selected value
    const selectedItem = this.inventoryList.find(item => item.InventoryItemId === event.value);
    this.selectionChanged.emit({
      tabId: selectedItem.ItemStatus,
      colorCode: selectedItem ? selectedItem.ItemColor : ''
    });
    this.calculateRLT();
  }

  selectionChangedItem(event:any){
    //console.log(event);
    const selectedItem = this.itemList.find(item => item.ItemMasterId == event.value);
    //console.log(selectedItem);
    this.myForm.controls['itemLt'].setValue(selectedItem.itemLT);
    this.calculateRLT();
    
  }

  getDeliveryDate(){
    this.deliveryDate = this.dataShareService.deliveryDate;
  }

  onDateSelection(event: MatDatepickerInputEvent<Date>) {
    //console.log('Selected date:', event.value);
    const selectedDate = this.datePipe.transform(event.value,"dd-MMM-yyyy");
    const selectedItem = this.inventoryList.find(item => item.InventoryItemId == this.myForm.value.inventoryStatus);
    //console.log(selectedDate);
    //console.log(selectedItem);
    this.calculateRLT()
    if(selectedItem.ItemStatus == "None"){
      let itemLT = this.myForm.value.itemLt;
    }
    
  }

  calculateRLT(){
    // this.deliveryDate = this.dataShareService.deliveryDate;
    const selectedItem = this.inventoryList.find(item => item.InventoryItemId == this.myForm.value.inventoryStatus);
    //console.log(selectedItem);
    let todayDate = new Date()
    let data = this.dynamicData.SandOPDetails[0]
    if(selectedItem?.ItemStatus == "None"){
      let itemLT = this.myForm.value.itemLt;
      if(this.myForm.value.itemId != '' && this.deliveryDateGeneral != '' && this.selectedProdLT != ''){
        let result = new Date(this.deliveryDateGeneral);
        result.setDate(new Date(this.deliveryDateGeneral).getDate() - (this.selectedProdLT + itemLT)) ;
        let differenceInDays = Math.round((result.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
        this.myForm.controls['rlt'].setValue(differenceInDays);
      }else{
        this.myForm.controls['rlt'].setValue(0);
      }
    }else if(selectedItem?.ItemStatus == "Ordered"){
      if(this.deliveryDateGeneral != '' && this.selectedProdLT != '' && this.myForm.value.partsArrivalDate != ''){
        let result = new Date(this.deliveryDateGeneral);
        let partsArrivalDate = new Date(this.myForm.value.partsArrivalDate);
        result.setDate(new Date(this.deliveryDateGeneral).getDate() - this.selectedProdLT) ;
        let differenceInDays = Math.round((result.getTime() - partsArrivalDate.getTime()) / (1000 * 60 * 60 * 24));
        this.myForm.controls['rlt'].setValue(differenceInDays);
      }else{
        this.myForm.controls['rlt'].setValue(0);
      }
    }else{
      this.myForm.controls['rlt'].setValue(0);
    }
  }

  // Method to bind S&OP data to the form
  bindSopData(data: any) {
    //console.log(data);
    const selectedItem = this.itemList.find(item => item.ItemMasterId == data.ItemId);

    // Patch values to the form
    this.myForm.patchValue({
      itemId: data.ItemId,
      vendorName: data.vendorName,
      purchaseID: data.purchaseId,
      partsArrivalDate: data.partsDeliveryDate == '' ? '' : this.ConvertDate(data.partsDeliveryDate) == '' ? '' :new Date(this.ConvertDate(data.partsDeliveryDate)),
      inventoryStatus: data.inventoryStatusId,
      itemLt: data.itemLT,
      inventoryIId:data.inventoryIId,
      serialNumber:data.serialNumber?data.serialNumber:""
      // rlt: data.RLT,
    });
  }

  // Method to retrieve the item list
  getItemList() {
    // Data object for item service
    let data: ItemMasterSelectEntity = {
      ItemMasterId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    // Subscribe to the item service to get the item list
    this.itemService.getItem(data).subscribe((res: any) => {
      //console.log(res);
      this.itemList = res;
    });
  }

  // Method to retrieve the inventory status list
  async getInventoryStatusList() {
    // Data object for inventory status service
    let data: InventoryItemStatusSelectEntity = {
      InventoryItemId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
  
    // Use await to wait for the response
    try {
      this.inventoryStatusService.InventoryItemStatusSelect(data).subscribe((res:any)=>{
        this.inventoryList = res.Table;
        this.calculateRLT();
      });
      //console.log(res, 'RES Inventory');
    } catch (error) {
      console.error('Error fetching inventory status:', error);
    }
  }
  

  // Method to initialize the form
  initForm() {
    this.myForm = this.fb.group({
      itemId: [0, Validators.required],
      vendorName: [''],
      purchaseID: [''],
      partsArrivalDate: [null],
      inventoryStatus: [null, Validators.required],
      itemLt: [0],
      rlt: [0],
      inventoryIId:[''],
      serialNumber:['']
    });
  }

  copyToRight(): void {
    // Copy AX data to S&OP data
    this.myForm.patchValue({ // Replace with the correct property from dynamicData
      inventoryIId:this.dynamicData.inventoryItemNumber,
      serialNumber:this.dynamicData.serialNumber,
      vendorName: this.dynamicData.vendorName,
      purchaseID: this.dynamicData.purchaseId,
      partsArrivalDate: this.dynamicData.partsArrivalDate == ('' || null) ? '' : this.ConvertDate(this.dynamicData.partsArrivalDate) == '' ? '' :new Date(this.ConvertDate(this.dynamicData.partsArrivalDate)), // Assuming partsDeliveryDate is a date string
      inventoryStatus: this.findInventoryItemIdByStatus(this.dynamicData.inventoryStatus),
      
    });
    if(this.dynamicData.inventoryStatus != '' || this.dynamicData.inventoryStatus != null){
      const selectedItem = this.inventoryList.find(item => item.ItemStatus === this.dynamicData.inventoryStatus);
      this.selectionChanged.emit({
        tabId: selectedItem.ItemStatus,
        colorCode: selectedItem ? selectedItem.ItemColor : ''
      });
      this.calculateRLT();
    }
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
  

  findInventoryItemIdByStatus(status: string): number | null {
    for (const item of this.inventoryList) {
      if (item.ItemStatus == status) {
        return item.InventoryItemId;
      }
    }
    return null; // Return null if no match is found
  }

  numberOnly(event: any): boolean {

    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 47 && charCode < 58) {
      return true;
    }
    return false;
  }

  // Method to format date using DatePipe
  formatDate(date: any, format: string): string {
    return this.datePipe.transform(date, format);
  }

  // Method to save data
  saveData(referenceItemName: any, InventoryItemId: any, inventoryItemNumber: any) {
    if(this.myForm.invalid){
      this.toastr.error("Please fill all mandatory fields!", "ERROR");
      this.myForm.markAllAsTouched();
      return;
    }
    // Get form values
    const form = this.myForm.value;

    // Data object for production planning service
    let data: IProductionPlanDynamicInsertUpdate = {
      soNumber: this.soNumber,
      itemId: form.itemId,
     
      vendorName: form.vendorName,
      purchaseId: form.purchaseID,
      partsDeliveryDate: this.datePipe.transform(form.partsArrivalDate,"dd-MMM-yyyy")?this.datePipe.transform(form.partsArrivalDate,"dd-MMM-yyyy"):'',
      inventoryStatusId: form.inventoryStatus,
      inventoryItemNumber: inventoryItemNumber,
      referenceItemName: referenceItemName,
      itemLt: form.itemLt,
      rltDays: form.rlt,
      InventoryItemId: InventoryItemId,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      Createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
      inventoryIId:form.inventoryIId,
      serialNumber:form.serialNumber
    };

    //console.log(data, 'Dynamic Data to Save');

    // Subscribe to the production planning service to save the data
    this.productionService.productionPlanningDynamicInsertUpdate(data).subscribe((res: any) => {
      //console.log(res);

      // Display success or error message using ToastrService
      if (res[0].SuccessMessage) {
        this.toastr.success(res[0].SuccessMessage, 'Success');
        if(this.flagSelected == "AX"){
          this.dataShareService.setSoListAXEdit(1);
        }else if(this.flagSelected == "SOP"){
          this.dataShareService.setSoListSOPEdit(1);
        }else{
          this.dataShareService.setSoListSOPEdit(0);
          this.dataShareService.setSoListAXEdit(0);
        }
      } else {
        this.toastr.error(res[0].ErrorMessage, 'Error');
      }
    });
  }

  cancelChange(){
    this.ngOnInit();
  }
}
