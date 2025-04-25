import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductionPlanningService } from '../../services/production-planning.service';
import { HelperService } from '../../../../services/helper.service';
import { DataSharingService } from '../../services/data-sharing.service';
import { IProductionPlanSelectSoNumberEntity } from '../../interfaces/production-sop';


@Component({
  selector: 'app-sop-pan-view',
  templateUrl: './sop-pan-view.component.html',
  styleUrls: ['./sop-pan-view.component.scss']
})
export class SopPanViewComponent implements OnInit {

  @Output() closePane: EventEmitter<any> = new EventEmitter<any>();
  // Array of dynamic tabs
  dynamicTabs: any[] = [];
  tabColors: any = '';

  loginDetails: any;
  generalData: any;
  actionData: any;
  bomData: any;
  specData: any;
  coData: any;
  decalData: any[]=[];
  dataBind: boolean = false;
  commonTableData: any[] = [];
  deliveryDateGeneral: Date;
  flagSelected:any;
  selectedProdLT: any = 0;
  attachmentDetails: any[]=[];
  tabView:boolean = false;
  private renderer: Renderer2;
  drawingDetails: any[]=[];
  attachmentAndDrawingStatus: any[];
  @Input() data:any;

  constructor(
    public productionPlanningService: ProductionPlanningService,
    private helperService: HelperService,
    private dataShareService:DataSharingService,
    rendererFactory: RendererFactory2
  ) { 
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    console.log(this.data);
    // Parse login details from stored value
    this.loginDetails = JSON.parse(this.helperService.getValue('LoginInfo'));

    // Fetch SOP detail data
    this.getSOPDetailData();
  }

  setActiveIndex(index:any){
    if(index){
      if(index >= 2){
        return index + this.dynamicTabs.length
      }else{
        return index;
      }
    }else{
      return 0;
    }
  }

  toggleTabs(){
    const matTabLinks = document.querySelector('.mat-mdc-tab-labels');
    const matTabButton = document.querySelector('.mat-mdc-tab-header-pagination');
    const matTabButtonAfter = document.querySelector('.mat-mdc-tab-header-pagination-after');
    const matTabButtonBefore = document.querySelector('.mat-mdc-tab-header-pagination-before');
    const matTabList = document.querySelector('.mat-mdc-tab-list');
    const buttonClass = document.querySelector('.mat-mdc-tab-header-pagination-disabled');
    // this.isFlex = !this.isFlex;
    this.tabView = !this.tabView;
    this.renderer.setStyle(matTabLinks, 'flex-wrap', this.tabView ? '' : 'wrap');
    this.renderer.setStyle(matTabButton, 'display', this.tabView ? 'flex' : 'none');
    this.renderer.setStyle(matTabButtonAfter, 'display', this.tabView ? 'flex' : 'none');
    this.renderer.setStyle(matTabList, 'transform', this.tabView ? 'translateX(0px)' : '');
    if(this.tabView){
      buttonClass.classList.remove('mat-mdc-tab-header-pagination-disabled');
      let clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      matTabButtonBefore.dispatchEvent(clickEvent);
    }
  }

  // Fetch SOP detail data from the server
  getSOPDetailData() {
    const data: IProductionPlanSelectSoNumberEntity = {
      soNumber: this.data.soNumber,
      TenantID: this.loginDetails.TenantId ? this.loginDetails.TenantId : 0
    };

    this.productionPlanningService.productionPlanningSelectbySONumber(data).subscribe((res: any) => {
      // Parse response data
      this.generalData = JSON.parse(res[0].general);
      console.log(this.generalData,"genral");
      this.commonTableData = JSON.parse(res[0].general)[0].axData;
      this.actionData = JSON.parse(res[0].actionDetails);
      this.dynamicTabs = JSON.parse(res[0].rltcal)[0].axdata || [];
      this.bomData = JSON.parse(res[0].bom);
      this.coData = JSON.parse(res[0].co);
      this.specData = JSON.parse(res[0].specReview);
      this.attachmentDetails = JSON.parse(res[0].attachmentDetails);
      this.drawingDetails = JSON.parse(res[0].drawingDetails);
      this.attachmentAndDrawingStatus = JSON.parse(res[0].attachmentAndDrawingStatus);
      this.decalData = JSON.parse(res[0].declasDetails);

      // Set dataBind flag to true to enable rendering of dynamic tabs
      this.dataBind = true;
    });
  }

  onSelectionChanged(selectionData: { tabId: string; colorCode: string }, index: any): void {
    // Access the selected value and color code in the parent component
    const selectedValue = selectionData.tabId;
    const colorCode = selectionData.colorCode;
  
    // Do something with the selected value and color code
    console.log('Selected value in parent:', selectedValue);
    console.log('Color code in parent:', colorCode);
    console.log(this.dynamicTabs);
  
    // Update inventoryStatus in both dynamicTabs and SandOPDetails
    const tabToUpdate = this.dynamicTabs[index];
    // tabToUpdate.inventoryStatus = selectedValue;
  
    // Check if SandOPDetails is available and update inventoryStatus
    if (tabToUpdate.SandOPDetails && tabToUpdate.SandOPDetails.length > 0) {
      tabToUpdate.SandOPDetails[0].itemColor = colorCode;
    }
  
    this.tabColors = colorCode;
    console.log(this.tabColors);
  }
  

  getColor(item: any) {
    const inventoryStatusFromSOP = item.SandOPDetails[0]?.itemColor;
    const inventoryStatusFromAX = item.ItemColor;

    if(inventoryStatusFromSOP == "null"){
      if(inventoryStatusFromAX == ""){
        return "#9bd1dd";
      }else{
        return inventoryStatusFromAX;
      }
    }else{
      return inventoryStatusFromSOP;
    }
  }

  getDeliveryDate(event:any){
    console.log(event);
    this.deliveryDateGeneral  = new Date(event);
  }

  getProductionLT(event:any){
    console.log(event);
    this.selectedProdLT  = event;
  }

  closePaneView(){
    this.closePane.emit(false);
  }


}
