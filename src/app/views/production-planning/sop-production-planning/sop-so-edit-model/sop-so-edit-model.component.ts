import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2, RendererFactory2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProductionPlanningService } from '../../services/production-planning.service';
import { HelperService } from '../../../../services/helper.service';
import { DataSharingService } from '../../services/data-sharing.service';
import { IProductionPlanSelectSoNumberEntity } from '../../interfaces/production-sop';


@Component({
  selector: 'app-sop-so-edit-model',
  templateUrl: './sop-so-edit-model.component.html',
  styleUrls: ['./sop-so-edit-model.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)', // Initial position (visible)
        opacity: 1
      })),
      state('out', style({
        transform: 'translateX(-100%)', // Slide out to the left (hidden)
        opacity: 0
      })),
      transition('in => out', [
        animate('0.5s ease-in-out') // Transition duration for hiding
      ]),
      transition('out => in', [
        animate('0.5s ease-in-out') // Transition duration for showing
      ])
    ])
  ]
})
export class SopSoEditModelComponent implements OnInit {

  // Array of dynamic tabs
  dynamicTabs: any[] = [];
  tabColors: any = '';

  loginDetails: any;
  generalData: any;
  actionData: any;
  bomData: any[] = [];
  specData: any[] = [];
  coData: any[] = [];
  decalData: any[] = [];
  dataBind: boolean = false;
  commonTableData: any[] = [];
  activeView: any = 'setting';
  deliveryDateGeneral: Date;
  flagSelected: any;
  selectedProdLT: any = 0;
  attachmentDetails: any[] = [];
  tabView: boolean = false;
  private renderer: Renderer2;
  drawingDetails: any[] = [];
  attachmentAndDrawingStatus: any[];
  soNumbersList: string[] = [];
  currentSo: string = '';
  finalSopData: any[] = [];
  slotList: any[] = [];
  panViewEnable: boolean = false;
  tabs = [
    {
      view: 'home',
      iconClass: 'fa-solid fa-user-tie',
      tooltip: 'Sales',
      label: 'Sales'
    },
    {
      view: 'setting',
      iconClass: 'fa-solid fa-truck-arrow-right',
      tooltip: 'Supply Chain',
      label: 'Supply Chain'
    },
    {
      view: 'production',
      iconClass: 'fa-solid fa-industry',
      tooltip: 'Production',
      label: 'Production'
    },
    {
      view: 'spec',
      iconClass: 'fa-solid fa-sheet-plastic',
      tooltip: 'Spec',
      label: 'Spec Review'
    },
    {
      view: 'bom',
      iconClass: 'fa-solid fa-file-invoice-dollar',
      tooltip: 'BOM',
      label: 'BOM'
    },
    {
      view: 'co',
      iconClass: 'fa-solid fa-clipboard-list',
      tooltip: 'CO',
      label: 'Change Order'
    },
    {
      view: 'attachments',
      iconClass: 'fa-solid fa-paperclip',
      tooltip: 'Documents',
      label: 'Documents'
    },
    {
      view: 'drawing',
      iconClass: 'fa-solid fa-compass-drafting',
      tooltip: 'Drawings',
      label: 'Drawings'
    },
  ];

  selectedIndex: number = 0;
  activeFlag: number = 3;
  soNumber: any;
  unSubscribe$=new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<SopSoEditModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public productionPlanningService: ProductionPlanningService,
    private helperService: HelperService,
    private dataShareService: DataSharingService,
    private toastr: ToastrService,
    rendererFactory: RendererFactory2,
    private cdr: ChangeDetectorRef
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  ngOnInit(): void {
    console.log(this.data);
   
    //console.log(this.soNumbersList , "SO LIST DATA");

    // Parse login details from stored value
    this.loginDetails = JSON.parse(this.helperService.getValue('LoginInfo'));

    // Fetch SOP detail data
    this.getSOPDetailData(this.data.tableData.soNumber);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.slotList = this.data.slotList;
    this.finalSopData = this.data.finalSopData;
    this.panViewEnable = this.data.panView;
    this.flagSelected = this.data.flag;
    this.soNumbersList = this.data.soNumbersList;
    this.currentSo = this.data.tableData.soNumber;
    this.soNumber = this.currentSo;
    this.activeView = this.data.activeView;  // For Active View Color Binding
    this.activeFlag = this.data.activeFlag;  // For Active View Color Binding

  }

  setActiveIndex(index: any) {
    if (index) {
      if (index >= 2) {
        return index + this.dynamicTabs.length
      } else {
        return index;
      }
    } else {
      return 0;
    }
  }

  toggleTabs() {
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
    if (this.tabView) {
      buttonClass.classList.remove('mat-mdc-tab-header-pagination-disabled');
      let clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      matTabButtonBefore.dispatchEvent(clickEvent);
    }
  }

  changeSo(type: 'next' | 'prev') {
    const currentIndex = this.soNumbersList.indexOf(this.currentSo);
    const newIndex = type === 'next' ? currentIndex + 1 : type === 'prev' ? currentIndex - 1 : -1;

    if (newIndex >= 0 && newIndex < this.soNumbersList.length) {
      this.currentSo = this.soNumbersList[newIndex];
      this.getSOPDetailData(this.currentSo);
    } else {
      console.error('Invalid index or SO number not found.');
      // Handle out-of-bounds or not found scenario as needed
    }
  }


  // Close the dialog
  onCancel() {
    if (this.data.flag == "AX") {
      const flag = this.dataShareService.axFlag
      //console.log(flag , "AX FLAG");
      this.dialogRef.close(flag);
    }
    if (this.data.flag == "SOP") {
      const flag = this.dataShareService.sopFlag
      //console.log(flag , "ASOP FLAG");
      this.dialogRef.close(flag);
    }
  }

  // Fetch SOP detail data from the server
  getSOPDetailData(soNumber: string) {
    const data: IProductionPlanSelectSoNumberEntity = {
      soNumber: soNumber,
      TenantID: this.loginDetails.TenantId ? this.loginDetails.TenantId : 0
    };

    this.productionPlanningService.productionPlanningSelectbySONumber(data).pipe(takeUntil(this.unSubscribe$)).subscribe({
      next : (res: any) => {
        console.log(res,"res");
        
        // Parse response data
        this.generalData = JSON.parse(res[0].general);
        //console.log(this.generalData,"genral");
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
      },
      error : (err: any) => {
        this.toastr.error("Something Went wrong", "ERROR");
      }
    });
  }

  onSelectionChanged(selectionData: { tabId: string; colorCode: string }, index: any): void {
    // Access the selected value and color code in the parent component
    const selectedValue = selectionData.tabId;
    const colorCode = selectionData.colorCode;

    // Do something with the selected value and color code
    //console.log('Selected value in parent:', selectedValue);
    //console.log('Color code in parent:', colorCode);
    //console.log(this.dynamicTabs);

    // Update inventoryStatus in both dynamicTabs and SandOPDetails
    const tabToUpdate = this.dynamicTabs[index];
    // tabToUpdate.inventoryStatus = selectedValue;

    // Check if SandOPDetails is available and update inventoryStatus
    if (tabToUpdate.SandOPDetails && tabToUpdate.SandOPDetails.length > 0) {
      tabToUpdate.SandOPDetails[0].itemColor = colorCode;
    }

    this.tabColors = colorCode;
    //console.log(this.tabColors);
  }


  getColor(item: any) {
    const inventoryStatusFromSOP = item.SandOPDetails[0].itemColor;
    const inventoryStatusFromAX = item.ItemColor;

    if (inventoryStatusFromSOP == "null") {
      if (inventoryStatusFromAX == "") {
        return "#9bd1dd";
      } else {
        return inventoryStatusFromAX;
      }
    } else {
      return inventoryStatusFromSOP;
    }
  }

  getDeliveryDate(event: any) {
    //console.log(event);
    this.deliveryDateGeneral = new Date(event);
  }

  getProductionLT(event: any) {
    //console.log(event);
    this.selectedProdLT = event;
  }

  // Set the background color for dropped slots based on status and slotId
  setDroppedSlotColor(status: any, slotId?: any) {
    if (status != null && status !== undefined && slotId !== 0) {
      return status.ItemColor || 'default-bg';
    } else if (slotId === 0) {
      return 'unavailableData';
    } else {
      return '';
    }
  }


  setProductionColor(status: any, slotId: any = 0, active: string = ''): string {
    const defaultColor = 'default-bg';
    const unavailableData = 'unavailableData';

    const colorMap: { [key: string]: string } = {
      production: 'PRDColor',
      home: 'salesColor',
      setting: 'ItemColor',
      spec: 'specColor',
      co: 'coColor',
      bom: 'bomColor',
      attachments: 'attachColor',
      drawing: 'drawingColor'
    };

    if (!status || slotId === 0) {
      return slotId === 0 ? unavailableData : '';
    }

    return status[colorMap[active]] || defaultColor;
  }

  setActiveBorderColor(slot: any) {
    // console.log(slot);
    if (slot) {
      if (slot.soNumber == this.currentSo) {
        return '2px solid black';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getSoDetails(slot: any) {
    if (slot) {
      this.currentSo = slot.soNumber;
      this.soNumber = slot.soNumber;
      this.getSOPDetailData(this.currentSo);
    } else {
      this.toastr.info("No 'SO' to display.")
    }
  }


  bindTextColor(status: any, slotId?: any) {
    if (status != (null || undefined) && slotId != 0) {
      return status.textColor || 'default-bg';
    }
  }

  enablePaneView() {
    this.panViewEnable = !this.panViewEnable;
  }

  changeView(view: string) {
    this.activeView = view;
    switch (view) {
      case 'home':
        this.activeFlag = 1;
        this.selectedIndex = 0;
        break;
      case 'user':
        this.activeFlag = 2;
        this.selectedIndex = 0;
        break;
      case 'setting':
        this.activeFlag = 3;
        this.selectedIndex = 0;
        break;
      case 'production':
        this.activeFlag = 4;
        this.selectedIndex = 0;
        break;
      case 'spec':
        this.activeFlag = 5;
        this.selectedIndex = 2;
        break;
      case 'bom':
        this.activeFlag = 6;
        this.selectedIndex = 2;
        break;
      case 'co':
        this.activeFlag = 7;
        this.selectedIndex = 2;
        break;
      case 'attachments':
        this.activeFlag = 8;
        this.selectedIndex = 4;
        break;
      case 'drawing':
        this.activeFlag = 9;
        this.selectedIndex = 5;
        break;
      default:
        this.activeFlag = 0;
        this.selectedIndex = 0;
        break;
    }
  }

  getCurrentWeekNumber(): string {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today.getTime() - startOfYear.getTime()) / 86400000;

    // Calculate the current week
    const currentWeek = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

    // Add 5 weeks
    let newWeek = currentWeek + 5;
    let year = today.getFullYear();

    // Handle overflow beyond 52 weeks
    if (newWeek > 52) {
      newWeek = newWeek % 52;
      year += 1;
    }

    // Format the week number with a leading zero
    const formattedWeek = newWeek.toString().padStart(2, '0');

    // Return in the desired format
    return `${formattedWeek}-${year}`;
  }

  isCurrentWeek(bucketName: string): boolean {
    const currentWeek = this.getCurrentWeekNumber();
    return bucketName === currentWeek;
  }

}

