import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SopSoDetailsModelComponent } from './sop-so-details-model/sop-so-details-model.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import { SopSoEditModelComponent } from './sop-so-edit-model/sop-so-edit-model.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';

import { HelperService } from '../../../services/helper.service';
import { ProductionPlanningService } from '../services/production-planning.service';
import { SalesStatusService } from '../services/sales-status.service';
import { ExportExcelService } from '../services/export-excel.service';
import { NewToastrService } from '../services/new-toastr.service';
import { InventoryItemStatusService } from '../services/inventory-item-status.service';
import { SpecReviewService } from '../services/spec-review.service';
import { BomService } from '../services/bom.service';
import { CoStatusService } from '../services/co-status.service';
import { AttachmentStatusService } from '../services/attachment-status.service';
import { DrawingStatusService } from '../services/drawing-status.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { IInsertUpdateSOP } from '../interfaces/insert-update-sop';
import { InventoryItemStatusSelectEntity } from '../interfaces/inventory-item-status-interface';
import { SpecreviewstatusSelectEntity } from '../interfaces/spec-review-interface';
import { BOMStatusSelectEntity } from '../interfaces/bom-interface';
import { COStatusSelectEntity } from '../interfaces/co-status-interface';
import { IProductionSOP } from '../interfaces/production-sop';

@Component({
  selector: 'app-sop-production-planning',
  templateUrl: './sop-production-planning.component.html',
  styleUrls: ['./sop-production-planning.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s ease-in-out',
          style({ transform: 'translateX(100%)', opacity: 0 })
        ),
      ]),
    ]),
  ],
})
export class SopProductionPlanningComponent implements OnInit {
  // Declare class properties
  activeView: any = 'setting';
  soList: any[] = [];
  sopData: any[] = [];
  finalSopData: any[] = [];
  finalSopDatacopy: any[] = [];
  slotList: any[] = [];
  filterSopList: any[] = [];
  loginInfo: any;
  selectedCapacityId: any;
  subscribedService: Subscription[] = [];
  soFilterInputValue: string = '';
  activeFlag: number = 3;
  searchPlaceholder: string = 'SO';
  placeholders: string[] = [
    'Search SO',
    'Search Dealer',
    'Search Sub Category',
  ];
  currentPlaceholder: string = 'Search SO';
  showPlaceholder: boolean = true;
  currentIndex: number = 0;
  typingEffectInterval: any;

  isHovered: boolean = false;
  menuData: any;
  menuAccess: any;
  subMenuAccess: any;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  scrollInterval: any;
  scrollSpeed = 20;
  isDragging = false;
  searchQuery: string = '';
  searchResult: boolean = false;
  panView: boolean = false;
  panData: any[] = [];
  selectedBusinessUnitId: string | null = null;
  tabs = [
    {
      view: 'home',
      iconClass: 'fa-solid fa-user-tie',
      tooltip: 'Sales',
      label: 'Sales',
    },
    {
      view: 'setting',
      iconClass: 'fa-solid fa-truck-arrow-right',
      tooltip: 'Supply Chain',
      label: 'Supply Chain',
    },
    {
      view: 'production',
      iconClass: 'fa-solid fa-industry',
      tooltip: 'Production',
      label: 'Production',
    },
    {
      view: 'spec',
      iconClass: 'fa-solid fa-sheet-plastic',
      tooltip: 'Spec',
      label: 'Spec Review',
    },
    {
      view: 'bom',
      iconClass: 'fa-solid fa-file-invoice-dollar',
      tooltip: 'BOM',
      label: 'BOM',
    },
    {
      view: 'co',
      iconClass: 'fa-solid fa-clipboard-list',
      tooltip: 'CO',
      label: 'Change Order',
    },
    {
      view: 'attachments',
      iconClass: 'fa-solid fa-paperclip',
      tooltip: 'Documents',
      label: 'Documents',
    },
    {
      view: 'drawing',
      iconClass: 'fa-solid fa-compass-drafting',
      tooltip: 'Drawings',
      label: 'Drawings',
    },
  ];
  selectedIndex: number = 0;
  soNumbersList: string[] = [];
  unsubscribe$ = new Subject<void>();
  salesStatusList: any[] = [];
  inventoryItemStatusList: any[] = [];
  specReviewStatusList: any[] = [];
  bomStatusList: any[] = [];
  coStatusList: any[] = [];
  attachmentStatusList: any[] = [];
  drawingStatusList: any[] = [];

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }

  // Constructor with dependency injection
  constructor(
    private helper: HelperService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private productionService: ProductionPlanningService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private salesStatusService: SalesStatusService,
    private excelService: ExportExcelService,
    private cdr: ChangeDetectorRef,
    private newToastr: NewToastrService,
    private inventoryService: InventoryItemStatusService,
    private specService: SpecReviewService,
    private bomService: BomService,
    private costatusService: CoStatusService,
    private attachmentStatus: AttachmentStatusService,
    private drawingStatusService: DrawingStatusService
  ) {
    // Subscribe to route params to get the selected capacity ID
    // console.log("CONSTRUCTOR");

    this.route.params.subscribe((params) => {
      const id = params['id'];
      console.log(id,"selectedid");
      
      this.selectedCapacityId = id;
      this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
      // Fetch the sales order list
      this.getSalesOrderList();
      this.getSOPData();
      this.searchQuery = '';
    });
  }

  // Lifecycle hook: ngOnInit
  ngOnInit(): void {
    this.selectedBusinessUnitId = this.helper.getUserBusinessId();
    console.log('Selected Business Unit ID:', this.selectedBusinessUnitId);
    // Initialize filterSopList with a copy of soList
    this.filterSopList = [...this.soList];
    this.menuData = JSON.parse(this.helper.getValue('leftMenu'));
    //this.setMenuAccess();
    this.getSalesStatusList();
    // this.getInventoryItemStatusList();
    this.getSpecStatusList();
    this.getBOMStatusList();
    this.getCOStatusList();
    this.getAttachmentStatusList();
    this.getDrawingStatusList();
    // this.startPlaceholderAnimation();
  }

  // startPlaceholderAnimation(): void {
  //   this.typingEffectInterval = setInterval(() => {
  //     this.triggerTypingEffect();
  //     this.currentIndex = (this.currentIndex + 1) % this.placeholders.length;
  //     this.currentPlaceholder = this.placeholders[this.currentIndex];
  //   }, 2000); // Change placeholder every 3 seconds
  // }

  // triggerTypingEffect(): void {
  //   // Toggle the class to restart animation
  //   this.showPlaceholder = false;
  //   setTimeout(() => {
  //     this.showPlaceholder = true;
  //   }, 50); // Small delay to force animation restart
  // }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  setMenuAccess() {
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
    this.subMenuAccess = this.menuAccess[0].children.filter(
      (e: any) => e.Menu_Name == 'S&OP'
    );
  }

  // Fetch the sales order list from the production service
  async getSalesOrderList() {
    let tenantID = this.loginInfo.TenantId ? this.loginInfo.TenantId : 0;
    let data = {
      tenantId: tenantID,
      capacityId: this.selectedCapacityId,
      site: JSON.parse(this.helper.getValue('capacityName')),
    };
    this.productionService.getSalesOrderList(data).subscribe((res: any) => {
      console.log(res, 'SO List');
      this.soList = res;
      this.filterSopList = [...this.soList];
    });
  }

  handleMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      // Check if left mouse button is pressed
      this.isDragging = true;
      this.startScrolling(event);
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.stopScrolling();
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      this.startScrolling(event);
    }
  }

  startScrolling(event: MouseEvent) {
    const container = this.scrollContainer.nativeElement;
    const scrollZoneWidth = 50; // Adjust as needed
    const scrollZoneHeight = 50; // Adjust as needed

    // Get the position of the cursor relative to the container
    const x = event.clientX - container.getBoundingClientRect().left;
    const y = event.clientY - container.getBoundingClientRect().top;

    // Get the dimensions of the container excluding the scrollbar
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Check if the cursor is near the edges of the container but not on the scrollbar
    if (x >= 0 && x <= containerWidth && y >= 0 && y <= containerHeight) {
      if (x < scrollZoneWidth) {
        this.startInterval(-this.scrollSpeed, 0);
      } else if (x > containerWidth - scrollZoneWidth) {
        this.startInterval(this.scrollSpeed, 0);
      } else if (y < scrollZoneHeight) {
        this.startInterval(0, -this.scrollSpeed);
      } else if (y > containerHeight - scrollZoneHeight) {
        this.startInterval(0, this.scrollSpeed);
      } else {
        this.stopScrolling();
      }
    } else {
      this.stopScrolling();
    }
  }

  startInterval(scrollX: number, scrollY: number) {
    clearInterval(this.scrollInterval);
    this.scrollInterval = setInterval(() => {
      this.scrollContainer.nativeElement.scrollBy(scrollX, scrollY);
    }, 50);
  }

  stopScrolling() {
    clearInterval(this.scrollInterval);
  }

  // Lifecycle hook: ngOnDestroy
  ngOnDestroy(): void {
    this.dialog.closeAll();
    // Unsubscribe from all subscribed services to prevent memory leaks
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  // Fetch SOP data based on selected capacity ID
  getSOPData() {
    // console.log("Simply");

    let data: IProductionSOP = {
      productionPlanningId: 0,
      tenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      capacityId: this.selectedCapacityId,
    };
    const productionSelectService = this.productionService
      .getProductionSop(data)
      .subscribe((res: any) => {
        // Filter SOP data based on the selected capacity ID
        console.log(res,"res");
        console.log(this.sopData,"this.sopData");
        
        this.sopData = res.filter(
          (e: any) => e.CapacityId == this.selectedCapacityId
        );
        console.log(this.sopData,"sopdata");
        
        console.log(this.sopData,"this.sopData1");
        this.soFilterInputValue = '';
        // Parse BucketPlanning property if present
        this.sopData.forEach((item: any) => {
          if (item.BucketPlanning) {
            item.BucketPlanning = JSON.parse(item.BucketPlanning);
          }
        });
        console.log(this.sopData,"sopdata");
        // Process SOP data and set slotList and finalSopData
        if (this.sopData.length != 0) {
          const weekWithMaxSlotClasses = this.findWeekWithMaxSlotName(
            this.sopData[0].BucketPlanning
          );
          console.log(weekWithMaxSlotClasses,"weekWithMaxSlotClasses");
          
          if (weekWithMaxSlotClasses) {
            this.slotList = this.createSlotArray(weekWithMaxSlotClasses);
          } else {
            this.slotList = [];
          }
          console.log(...this.sopData[0].BucketPlanning,"bucket");
          
          this.finalSopData = [...this.sopData[0].BucketPlanning];
          console.log(this.finalSopData,"this.finalSopData");
          
          this.setFinalSopData();
        }
      });
    // Add the subscription to the subscribedService array
    this.subscribedService.push(productionSelectService);
  }

  // Process final SOP data to ensure consistency in slot planning
  setFinalSopData() {
    this.finalSopData.forEach((item, index) => {

      item.originalIndex = index;
      item.SlotPlanning.forEach((slot) => {
        // Ensure that every slot has a SoList array
        if (!slot.SoList) {
          slot.SoList = [];
        }
      });
      item.SlotPlanning.sort((a, b) => a.SlotName - b.SlotName);
      if (item.SlotPlanning.length === 0) {
        // If slotList is empty, insert dummy data with slot names [1, 2, 3, 4]
        item.SlotPlanning = this.slotList.map((slotName) => ({
          SlotId: 0, // Dummy slotId
          SlotName: slotName.toString(),
          SoList: [],
        }));
      } else {
        // If slotList is not empty, check and insert dummy data if slotName is not available
        this.slotList.forEach((slotName) => {
          const existingSlot = item.SlotPlanning.find(
            (slot) => slot.SlotName == slotName.toString()
          );
          if (!existingSlot) {
            // If slotName is not available, insert dummy data at that index
            const dummySlot = {
              SlotId: 0, // Dummy slotId
              SlotName: slotName.toString(),
              SoList: [],
            };
            const index = this.slotList.indexOf(slotName);
            item.SlotPlanning.splice(index, 0, dummySlot);
          }
        });
      }
    });
    //console.log(this.finalSopData, 'Final Data');

    console.log(this.finalSopData,"finalsopdata439")
    this.soNumbersList = this.finalSopData.flatMap((bucket) =>
      bucket.SlotPlanning.flatMap((slot) =>
        slot.SoList.map((so) => so.soNumber)
      )
    );
    console.log(this.soNumbersList,"this.soNumbersList");

    this.finalSopDatacopy = this.finalSopData;

    console.log(this.finalSopData,"this.finalSopData")

    const slotDetails: any[] = JSON.parse(this.sopData[0].slotDetails);
    console.log(slotDetails,"slotDetails")

    //console.log(slotDetails);
    //console.log(this.slotList);

    this.slotList.forEach((slot, index) => {
      let match = slotDetails.find((item) => item.slotName == slot);
      if (match) {
        this.slotList[index] = match.slotNameDis;
      } else {
        this.slotList[index] = 'Slot ' + slot;
      }
    });
    //console.log(this.slotList);
    this.filterColumn();

    //  this.finalSopData=filteredSlots;
  }
  // setFinalSopData() {
  //   if (!this.finalSopData) {
  //     console.error("finalSopData is undefined");
  //     return;
  //   }
  
  //   this.finalSopData.forEach((item, index) => {
  //     item.originalIndex = index;
  //     item.SlotPlanning.forEach((slot) => {
  //       if (!slot.SoList) {
  //         slot.SoList = [];
  //       }
  //     });
  //     item.SlotPlanning.sort((a, b) => a.SlotName - b.SlotName);
  
  //     if (item.SlotPlanning.length === 0) {
  //       item.SlotPlanning = this.slotList.map((slotName) => ({
  //         SlotId: 0,
  //         SlotName: slotName.toString(),
  //         SoList: [],
  //       }));
  //     } else {
  //       this.slotList.forEach((slotName) => {
  //         const existingSlot = item.SlotPlanning.find(
  //           (slot) => slot.SlotName == slotName.toString()
  //         );
  //         if (!existingSlot) {
  //           const dummySlot = {
  //             SlotId: 0,
  //             SlotName: slotName.toString(),
  //             SoList: [],
  //           };
  //           const index = this.slotList.indexOf(slotName);
  //           item.SlotPlanning.splice(index, 0, dummySlot);
  //         }
  //       });
  //     }
  //   });
  
  //   console.log(this.finalSopData, "finalSopData");
  
  //   this.soNumbersList = this.finalSopData.flatMap((bucket) =>
  //     bucket.SlotPlanning.flatMap((slot) => slot.SoList.map((so) => so.soNumber))
  //   );
  
  //   console.log(this.soNumbersList, "this.soNumbersList");
  
  //   this.finalSopDatacopy = [...this.finalSopData]; // Avoid reference issue
  //   console.log(this.finalSopData, "this.finalSopData");
  
  //   // 🛑 Check if sopData exists before using it
  //   if (!this.sopData || this.sopData.length === 0) {
  //     console.error("sopData is empty or undefined", this.sopData);
  //     return;
  //   }
  
  //   // 🛑 Validate slotDetails before parsing
  //   const slotDetailsString = this.sopData[0]?.slotDetails;
  //   if (!slotDetailsString) {
  //     console.error("slotDetails is undefined or null", slotDetailsString);
  //     return;
  //   }
  
  //   let slotDetails: any[] = [];
  //   try {
  //     slotDetails = JSON.parse(slotDetailsString);
  //     console.log(slotDetails, "slotDetails");
  //   } catch (error) {
  //     console.error("Error parsing slotDetails:", error);
  //     return;
  //   }
  
  //   this.slotList.forEach((slot, index) => {
  //     let match = slotDetails.find((item) => item.slotName == slot);
  //     this.slotList[index] = match ? match.slotNameDis : "Slot " + slot;
  //   });
  
  //   this.filterColumn();
  // }
  
  filterColumn() {
    //console.log('Search query:', this.searchQuery);
    if (this.searchQuery != '') {
      const filteredSlots = this.filterSlotsBySoNumberAndLength(
        this.finalSopDatacopy,
        this.searchQuery
      );
      this.finalSopData = filteredSlots;
      this.searchResult = true;
      //console.log(this.finalSopData, 'Filterd data');
    } else {
      this.finalSopData = this.finalSopDatacopy;
      this.searchResult = false;
    }
  }

  filterSlotsBySoNumberAndLength(finalSopData?: any, soNumber?: string): any {
    // Filter slots by soNumber
    return finalSopData.filter((bucket) => {
      const hasMatchingSoNumber = bucket.SlotPlanning.some((slot) =>
        slot.SoList.some((order) => {
          const soNumberLowerCase = (order.soNumber || '').toLowerCase(); // Null check added here
          const customerNameLowerCase = (
            order.customerName || ''
          ).toLowerCase(); // Null check added here
          const dealerNameLowerCase = (order.dealerName || '').toLowerCase(); // Null check added here
          const subCategoryNameLowerCase = (
            order.subCategoryName || ''
          ).toLowerCase(); // Null check added here

          return (
            soNumberLowerCase.includes(soNumber?.toLowerCase() || '') ||
            customerNameLowerCase.includes(soNumber?.toLowerCase() || '') ||
            dealerNameLowerCase.includes(soNumber?.toLowerCase() || '') ||
            subCategoryNameLowerCase.includes(soNumber?.toLowerCase() || '')
          );
        })
      );
      const hasNonEmptySoList = bucket.SlotPlanning.some(
        (slot) => slot.SoList.length > 0
      );
      return hasMatchingSoNumber && hasNonEmptySoList;
    });
  }

  // Example usage

  // Find the week with the maximum slot name
  findWeekWithMaxSlotName(data: any[]): any {
    let greatestSlotName = null;
    data.forEach((item) => {
      item.SlotPlanning.forEach((slot) => {
        const currentSlotName = parseInt(slot.SlotName);
        if (greatestSlotName === null || currentSlotName > greatestSlotName) {
          greatestSlotName = currentSlotName;
        }
      });
    });
    return greatestSlotName;
  }

  // Create an array of slots based on the given slot count
  createSlotArray(slot: any): any[] {
    const slotArray: any[] = [];
    for (let i = 1; i <= slot; i++) {
      slotArray.push(i);
    }
    return slotArray;
  }

  getEnableFor() {
    // console.log(this.activeView);
    let enableMenu = ['spec', 'bom', 'co', 'attachments', 'drawing'];
    if (enableMenu.includes(this.activeView)) {
      return true;
    } else {
      return false;
    }
  }

  getInfoComments(item: any) {
    // console.log(item);
    switch (this.activeView) {
      case 'spec':
        return item.specComment.trim();
      case 'bom':
        return item.bomComment.trim();
      case 'co':
        return item.coComment.trim();
      case 'attachments':
        return item.attachmentComment.trim();
      case 'drawing':
        return item.drawingComment.trim();
      default:
        return '';
    }
  }

  // Change the active view
  changeView(view: string) {
    console.log(view);
    
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

  // Get the displayed value based on the active view
  getDisplayedValue(slot: any): string {
    switch (this.activeView) {
      case 'home':
        return slot.soNumber;
      case 'user':
        return slot.customerName;
      case 'setting':
        return slot.subCategoryName !== null ? slot.subCategoryName : '-----';
      default:
        return '----';
    }
  }

  // Change the single view based on the event
  changeSingleView(slot: any, e: string) {
    const resetViews = () => {
      slot.activeSetting = false;
      slot.activeUser = false;
      // Uncomment the line below if needed
      // this.getDisplayedValue(slot);
    };

    if (e === 'user') {
      slot.activeUser = true;
      setTimeout(() => {
        slot.activeUser = false;
      }, 2000);
    } else if (e === 'setting') {
      slot.activeSetting = true;
      setTimeout(() => {
        slot.activeSetting = false;
      }, 2000);
    } else {
      resetViews();
    }
  }

  // Set the background color based on the status
  setSlotColor(status: any) {
    const colorMap = {
      None: 'red-bg',
      '': 'blue-bg',
      null: 'blue-bg',
      'Reserved On Site': 'green-bg',
      'Received On Site': 'green-bg',
      Completed: 'green-bg',
      Ordered: 'yellow-bg',
    };

    return colorMap[status] || 'default-bg';
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

  setProductionColor(
    status: any,
    slotId: any = 0,
    active: string = ''
  ): string {
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
      drawing: 'drawingColor',
    };

    if (!status || slotId === 0) {
      return slotId === 0 ? unavailableData : '';
    }

    return status[colorMap[active]] || defaultColor;
  }

  bindTextColor(status: any, slotId?: any) {
    if (status != (null || undefined) && slotId != 0) {
      return status.textColor || 'default-bg';
    }
  }

  // Filter the sales order list based on user input
  filterSoList(event: any) {
    let value = event.target.value.toLowerCase();
    this.filterSopList = this.soList.filter((item: any) =>
      item.soNumber.toLowerCase().includes(value)
    );
  }

  // Open the sales order details dialog
  getSoDetails(data: any) {
    const dialogRef = this.dialog.open(SopSoDetailsModelComponent, {
      width: '60%', // Adjust the width as needed
      data: {
        title: data.soNumber,
        tableData: data,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle the result if needed
      }
    });
  }

  // Handle the drop event for the drag-and-drop functionality
  async dropList(event: CdkDragDrop<any[]>, slotId?: any, soList?: any) {
    // if (
    //   !this.subMenuAccess[0].EditAccess ||
    //   !this.subMenuAccess[0].DeleteAccess ||
    //   !this.subMenuAccess[0].AddAccess
    // ) {
    //   this.toastr.warning('No allowed to modify data.', 'WARNING');
    // }
    //  else
     
      if (slotId == 0) {
        this.toastr.warning('Slot unavailable', 'WARNING');
      } else if (soList.length == 1) {
        this.toastr.warning('Only 1 SO is allowed in 1 slot.', 'WARNING');
      } 
      else {
        if (event.previousContainer === event.container) {
          // If dropped within the same container, move the item within the array
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        } else {
          // If dropped in a different container, transfer the item between arrays
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
          this.saveData();
       // }
      //}
    }
    //console.log(this.soList);
    //console.log(this.filterSopList);
  
}
  }

  // Remove an item from the slot list based on bucket index and slot index
  removeFromSlotList(
    bucketIndex: number,
    slotIndex: number,
    soList: any
  ): void {
    //console.log(soList);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: `Do you want to remove ${soList[0].soNumber}?`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        if (bucketIndex >= 0 && slotIndex >= 0) {
          const removedItem =
            this.finalSopData[bucketIndex].SlotPlanning[slotIndex].SoList.pop();
          if (removedItem) {
            this.getSalesOrderList();
            this.saveData();
          }
        }
      }
    });
  }

  // Save the modified SOP data
  saveData() {
    if (this.searchResult) {
      
      this.finalSopData.map((element) => {
        this.finalSopDatacopy[element.originalIndex].SlotPlanning =
          element.SlotPlanning;
      });
      //console.log(this.finalSopDatacopy, 'After drag');
    } else {
      this.finalSopDatacopy = this.finalSopData;
    }

    // Create a new array with filtered data without modifying finalSopData
    let finalResult = this.finalSopDatacopy.map((item) => ({
      ...item,
      SlotPlanning: item.SlotPlanning.filter((slot) => slot.SlotId !== 0),
    }));

    let finalDataToSend = {
      CapacityId: this.selectedCapacityId,
      BucketPlanning: finalResult,
    };

    let data: IInsertUpdateSOP = {
      capacityId: +this.selectedCapacityId,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdby: 0,
      jsonData: JSON.stringify(finalDataToSend),
      businessunitId:+this.selectedBusinessUnitId
    };

    // Call the production service to insert/update SOP data
    this.productionService.insertUpdateSOP(data).subscribe(async (res: any) => {
      //console.log(res, 'SOP DATA INSERT');
      // this.toastr.success(res[0].SuccessMessage);
      this.newToastr.showSuccess('Data Saved Successfully.');
      this.soFilterInputValue = '';
      await this.getSalesOrderList();
      this.getSOPData();
      // this.filterColumn();
    });

    //console.log(finalDataToSend, 'Final Data');
  }

  enablePanView(data: any) {
    this.panView = !this.panView;
    this.panData = data;
  }

  closePaneView(value: any) {
    this.panView = value;
  }

  // Open the sales order edit dialog
  editSo(slotData: any, flag: any, panView: boolean) {
    alert("hi")
    // if (!this.subMenuAccess[0].EditAccess) {
    //   this.toastr.warning('No allowed to edit data.', 'WARNING');
    // } 
    // else {
    console.log(this.soNumbersList,"this.soNumbersList");
    
      const dialogRef = this.dialog.open(SopSoEditModelComponent, {
        minWidth: '95vw', // Adjust the width as needed
        data: {
          title: '${slotData.soNumber} Details',
          tableData: slotData,
          flag: flag,
          selectedIndex: this.selectedIndex,
          soNumbersList: this.soNumbersList,
          finalSopData: this.finalSopData,
          slotList: this.slotList,
          soNumber: slotData.soNumber,
          panView: panView,
          activeView: this.activeView,
          activeFlag: this.activeFlag,
          parentComponent: this,
        },
        minHeight: '95vh',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.soFilterInputValue = '';
        this.getSOPData();
      });
   // }
  }

  generatePDF() {
    const element: HTMLElement = document.getElementById(
      'pdfContent'
    ) as HTMLElement;

    // Capture the visible part
    html2canvas(element, {
      backgroundColor: null,
      scrollX: 0,
      scrollY: -window.scrollY, // Capture entire scrollable area
    }).then((canvas1) => {
      const imgData1 = canvas1.toDataURL('image/png');

      // Scroll to the bottom to reveal the hidden part
      element.scrollTop = element.scrollHeight;

      // Calculate the height of the entire scrollable area
      const fullHeight = element.scrollHeight;

      // Capture the hidden part
      html2canvas(element, {
        backgroundColor: null,
        scrollX: 0,
        scrollY: 0,
        windowHeight: fullHeight, // Capture entire scrollable area
      }).then((canvas2) => {
        const imgData2 = canvas2.toDataURL('image/png');

        // Combine the two images into one PDF
        const pdf = new jspdf.jsPDF();
        const imgHeight1 = (canvas1.height * 208) / canvas1.width;
        const imgHeight2 = (canvas2.height * 208) / canvas2.width;

        pdf.addImage(imgData1, 'PNG', 0, 0, 208, imgHeight1);
        pdf.addPage();
        pdf.addImage(imgData2, 'PNG', 0, 0, 208, imgHeight2);

        pdf.save('sop_data.pdf');
      });
    });
  }

  getExcelData() {
    let data = {
      capacityId: this.selectedCapacityId,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      flag: this.activeFlag,
    };

    const excelExportAPI = this.productionService
      .ProductionPlanExcelExport(data)
      .subscribe((res: any) => {
        //console.log(res);
        const newData = res.Table1.map(
          ({ BucketId, OrderID, ...rest }) => rest
        );
        //console.log(newData);

        const columnString = res.Table[0].columnName;
        const columnsToRemove = ['BucketId']; // Add more column names to remove if needed

        // Split the string into an array of column names
        const columnsArray = columnString.split(',');

        // Filter out the columns to remove
        const filteredColumns = columnsArray.filter(
          (column) => !columnsToRemove.includes(column)
        );

        //console.log(filteredColumns);
        this.exportToExcel(newData, filteredColumns);
      });
  }

  exportToExcel(data: any, columns: any) {
    let currentDateTime = this.datePipe.transform(
      new Date(),
      'MM/dd/yyyy h:mm:ss'
    );
    let finalData = [];
    data.forEach((row: any) => {
      finalData.push(Object.values(row));
    });
    let exceldisplayColumns = columns;
    //console.log(exceldisplayColumns);

    let tableData = {
      image: 'assets/images/Fouts-Fire.png',
      title: 'Production Planning',
      data: finalData,
      headers: exceldisplayColumns,
      excelfilename: 'Production Planning' + currentDateTime,
      sheetname: 'Production Planning',
    };

    if (data != undefined && data != null && data.length > 0)
      this.excelService.exportExcelForProductionPlanning(tableData);
    else this.toastr.error('No data to display');
  }

  getSalesStatusList() {
    const salesStatusData: any = {
      salesStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.salesStatusService
      .getSalesStatus(salesStatusData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.salesStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getInventoryItemStatusList() {
    const inventoryData: InventoryItemStatusSelectEntity = {
      InventoryItemId: 0,
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.inventoryService
      .InventoryItemStatusSelect(inventoryData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.inventoryItemStatusList = res.Table;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getSpecStatusList() {
    let specData: SpecreviewstatusSelectEntity = {
      SpecreviewstatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.specService
      .getSpec(specData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.specReviewStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getBOMStatusList() {
    let bomData: BOMStatusSelectEntity = {
      BOMStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.bomService
      .GetBom(bomData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.bomStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getCOStatusList() {
    let coData: COStatusSelectEntity = {
      CustomerOrderStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.costatusService
      .GetCOStatus(coData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.coStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getAttachmentStatusList() {
    const attachmentData: any = {
      AttachmentStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.attachmentStatus
      .getAttachmentStatus(attachmentData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.attachmentStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getDrawingStatusList() {
    const drawingStatusData: any = {
      drawingStatusId: 0,
      tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    this.drawingStatusService
      .getDrawingStatus(drawingStatusData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: any) => {
          this.drawingStatusList = res;
        },
        error: (error: Error) => {
          this.toastr.error(error.message, 'ERROR');
        },
      });
  }

  getActiveStatusLegend(active: any) {
    switch (active) {
      case 1:
        return this.salesStatusList;
      case 3:
        return this.inventoryItemStatusList;
      case 5:
        return this.specReviewStatusList;
      case 6:
        return this.bomStatusList;
      case 7:
        return this.coStatusList;
      case 8:
        return this.attachmentStatusList;
      case 9:
        return this.drawingStatusList;
      default:
        return [];
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
