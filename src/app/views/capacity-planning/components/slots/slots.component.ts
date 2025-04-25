import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StepChangedService } from '../../../../services/step-changed.service';
import { HelperService } from '../../../../services/helper.service';
import { Router } from '@angular/router';
import { SaveLayoutService } from '../../services/save-layout.service';
import { SlotDeleteEntity, SlotSelectEntity } from '../../interfaces/slots';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { SlotSaveEntity } from '../../interfaces/capacity-planning-area';
import { AddEditSlotsComponent } from '../../models/add-edit-slots/add-edit-slots.component';
import { SlotService } from '../../services/slot.service';

@Component({
  selector: 'app-slots',
  templateUrl: './slots.component.html',
  styleUrl: './slots.component.scss'
})
export class SlotsComponent {
  onCancel() {
    throw new Error('Method not implemented.');
    }
      searchInput: any='';
      menuData: any;
      menuAccess: any;
    
      @Input() public set SlotData(data: any) {
        if (data != undefined && data != null && data != "") {
          this.getSlotData();
        }
      }
    
      filteredList: any[] = [];
      slotList: any[] = [];
      droppedList: any[] = [];
      selectedDropBoxIndex: number = -1;
      loginInfo: any;
      subscribedService: Subscription[] = [];
      dataDropped: boolean = false;
      slotSelectedData: any[] = [];
    
      constructor(
        private toastr: ToastrService,
        private dialog: MatDialog,
        private stepChangeService: StepChangedService,
        private helper: HelperService,
        private router:Router,
        private slotService: SlotService,
        private saveLayoutService: SaveLayoutService
      ) { }
    
     /**
     * Component lifecycle hook - Initialization
     * Sets up initial data and configurations
     */
    ngOnInit(): void {
      try {
        // Initialize user login info and menu data from storage
        this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
        this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '[]');
        
        // Set up menu access permissions and fetch slot data
        this.setMenuAccess();
        this.getSlotData();
      } catch (error) {
        console.error('Error in ngOnInit:', error);
        this.toastr.error('Error initializing component', 'ERROR');
      }
    }
    
    /**
     * Sets up menu access based on current route
     * Filters menu items to determine user permissions
     */
    setMenuAccess(): void {
      try {
        // Get current route URL
        let routerLink = this.router.url;
        
        // Filter menu items based on current route
        this.menuAccess = this.menuData.filter((e: any) => routerLink.includes(e.MenuPath));
        
        // Debug logging
        console.log('Menu Access:', this.menuAccess);
        console.log('Router Link:', routerLink);
      } catch (error) {
        console.error('Error in setMenuAccess:', error);
        this.toastr.error('Error setting menu access', 'ERROR');
      }
    }
    
    /**
     * Component lifecycle hook - Cleanup
     * Unsubscribes from all active subscriptions
     */
    ngOnDestroy(): void {
      try {
        // Unsubscribe from all subscriptions to prevent memory leaks
        this.subscribedService.forEach((element) => {
          element.unsubscribe();
        });
      } catch (error) {
        console.error('Error in ngOnDestroy:', error);
      }
    }
    
    /**
     * Fetches slot data from the service
     * Updates slot lists and selected data
     */
    getSlotData(): void {
      try {
        // Get capacity data from storage
        let data: any = JSON.parse((this.helper.getValue("capacity") ? 
          this.helper.getValue("capacity") : "{}") || '{}');
        
        // Reset selected drop box index
        this.selectedDropBoxIndex = -1;
    
        // Prepare slot selection data
        const slotData: SlotSelectEntity = {
          CapacityId: data.CapacityId ? data.CapacityId : 0,
          BucketId: data.BucketId ? data.BucketId : 0,
          SlotId: 0,
          TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
        }
    
        // Call slot selection service
        const slotSelectService = this.slotService.SlotSelect(slotData)
          .subscribe({
            next: (res: any) => {
              // Handle Table data (slot list)
              if (res.Table != null && res.Table != undefined && res.Table.length > 0) {
                this.slotList = res.Table;
                this.filteredList = this.slotList;
                this.filteredList = [...this.filteredList];
              } else {
                this.slotList = [];
                this.filteredList = this.slotList;
                this.filteredList = [...this.slotList];
              }
    
              // Handle Table1 data (dropped list)
              if (res.Table1 != null && res.Table1 != undefined && res.Table1.length > 0) {
                this.droppedList = res.Table1;
                this.droppedList = [...this.droppedList];
              } else {
                this.droppedList = [];
              }
    
              // Handle Table2 data (selected slot data)
              if (res.Table2 != null && res.Table2 != undefined && res.Table2.length > 0) {
                this.slotSelectedData = res.Table2;
              } else {
                this.slotSelectedData = [];
              }
            },
            error: (error: any) => {
              console.error('Error fetching slot data:', error);
              this.toastr.error("Some Error Occurred", "ERROR");
            }
          });
    
        // Store subscription for cleanup
        this.subscribedService.push(slotSelectService);
      } catch (error) {
        console.error('Error in getSlotData:', error);
        this.toastr.error("Error processing slot data", "ERROR");
      }
    }
    
    /**
     * Filters the slot list based on search input
     * @param event - Search input value
     */
    filterList(event: any): void {
      try {
        let input = event.toLowerCase();
        
        if (input === "") {
          // Show all items if search is empty
          this.filteredList = this.slotList;
        } else {
          // Filter items based on slot name
          this.filteredList = this.slotList.filter(
            (item) => item.SlotName.toLowerCase().includes(input)
          );
        }
      } catch (error) {
        console.error('Error in filterList:', error);
        this.toastr.error("Error filtering slots", "ERROR");
      }
    }
    
    /**
     * Toggles selection state of drop box
     * @param index - Index of clicked drop box
     * @param rowData - Data of selected row
     */
    toggleBackgroundColor(index: number, rowData: any): void {
      try {
        if (this.selectedDropBoxIndex === index) {
          // Deselect if already selected
          this.selectedDropBoxIndex = -1;
        } else {
          // Select the clicked drop-box
          this.selectedDropBoxIndex = index;
        }
      } catch (error) {
        console.error('Error in toggleBackgroundColor:', error);
        this.toastr.error("Error toggling selection", "ERROR");
      }
    }
    
     /**
     * Handles drag and drop events for slots
     * @param event - The drag and drop event object
     */
    drop(event: CdkDragDrop<string[]>) {
      try {
        // Get capacity data from storage
        const data: any = JSON.parse(this.helper.getValue("capacity") || '{}');
        console.log("Drop data:", data);
    
            // Handle drops within the same container
            if (event.previousContainer === event.container) {
              if (event.previousContainer.data == this.droppedList) {
                // Reorder items within the same container
                moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
                
                // Update step change data
                let stepChangeData = {
                  dataChanged: true,
                  step: 3
                }
                this.stepChangeService.setPreviousStep(stepChangeData);
              }
            } else {
              // Handle drops between different containers
              if (data.CapacityId && data.BucketId) {
                this.dataDropped = true;
                
                // Transfer item between containers
                transferArrayItem(
                  event.previousContainer.data,
                  event.container.data,
                  event.previousIndex,
                  event.currentIndex,
                );
      
                // Update step change data
                let stepChangeData = {
                  dataChanged: true,
                  step: 3
                }
                this.stepChangeService.setPreviousStep(stepChangeData);
              } else {
                this.toastr.warning('Select Bucket and Capacity First', 'Cannot Drop');
              }
            }
      } catch (error) {
        console.error('Error in drop:', error);
        this.toastr.error("Error during drag and drop operation", "ERROR");
      }
    }
    
    /**
     * Opens dialog to add a new slot
     * @param event - The click event
     */
    addSlot(event: Event) {
      try {
        event.stopPropagation();
        
        // Open add slot dialog
        const dialogRef = this.dialog.open(AddEditSlotsComponent, {
          width: '32%',
          data: {
            title: 'Add Slot',
            button: 'Save'
          },
          disableClose: true
        });
    
        // Handle dialog close
        dialogRef.afterClosed().toPromise()
          .then((result) => {
            if (result == true) {
              this.getSlotData();
            }
          })
          .catch(error => {
            console.error('Error in dialog:', error);
            this.toastr.error("Error adding slot");
          });
      } catch (error) {
        console.error('Error in addSlot:', error);
        this.toastr.error("Error opening add slot dialog");
      }
    }
    
    /**
     * Opens dialog to edit an existing slot
     * @param row - The slot data to edit
     * @param event - The click event
     */
    editSlot(row: any, event: Event) {
      try {
        event.stopPropagation();
        
        // Open edit slot dialog
        const dialogRef = this.dialog.open(AddEditSlotsComponent, {
          width: '32%',
          data: {
            title: 'Update Slot',
            button: 'Update',
            value: row
          },
          disableClose: true
        });
    
        // Handle dialog close
        dialogRef.afterClosed().toPromise()
          .then((result) => {
            if (result == true) {
              this.getSlotData();
            }
          })
          .catch(error => {
            console.error('Error in dialog:', error);
            this.toastr.error("Error updating slot");
          });
      } catch (error) {
        console.error('Error in editSlot:', error);
        this.toastr.error("Error opening edit slot dialog");
      }
    }
    
    /**
     * Handles slot deletion
     * @param row - The slot data to delete
     * @param event - The click event
     */
    deleteSlot(row: any, event: Event) {
      try {
        if (this.dataDropped) {
          this.toastr.warning('Save Changes Before Deleting.', 'Close');
          return;
        }
    
        event.stopPropagation();
        
        // Open confirmation dialog
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '30%',
          data: {
            title: 'Confirm Action',
            message: 'Are you sure you want to delete?',
          },
        });
    
        // Handle confirmation response
        dialogRef.afterClosed().subscribe({
          next: (result) => {
            if (result == true) {
              const slotData: SlotDeleteEntity = {
                slotId: row.SlotId,
                tenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
              }
    
              // Call delete service
              const slotDeleteService = this.slotService.SlotDelete(slotData)
                .subscribe({
                  next: (res: any) => {
                    if (res.Table[0].SuccessMessage) {
                      this.toastr.success(res.Table[0].SuccessMessage, 'Success');
                    } else {
                      this.toastr.error(res.Table[0].ErrorMessage, 'Error');
                    }
                    this.getSlotData();
                  },
                  error: (error: any) => {
                    console.error('Delete error:', error);
                    this.toastr.error("Some Error Occurred", "ERROR");
                  }
                });
    
              this.subscribedService.push(slotDeleteService);
            }
          },
          error: (error) => {
            console.error('Dialog error:', error);
            this.toastr.error("Error in deletion process");
          }
        });
      } catch (error) {
        console.error('Error in deleteSlot:', error);
        this.toastr.error("Error processing delete request");
      }
    }
    
    /**
     * Saves the current slot configuration
     */
    saveSlot() {
      try {
        if (this.dataDropped) {
          // Update step change data
          let stepChangeData = {
            dataChanged: false,
            step: 3
          }
          this.stepChangeService.setPreviousStep(stepChangeData);
    
          if (this.droppedList != undefined) {
            // Add index to each item in dropped list
            const jsonArrayWithIndex = this.droppedList.map((jsonObj, index) => {
              jsonObj.index = index;
              return jsonObj;
            });
    
            // Get capacity data
            let data: any = JSON.parse((this.helper.getValue("capacity") ? 
              this.helper.getValue("capacity") : "{}") || '{}');
    
            // Prepare save data
            let saveData: SlotSaveEntity = {
              flag: 3,
              TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
              CapacityId: data.CapacityId ? data.CapacityId : 0,
              CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
              JsonData: this.droppedList.length > 0 ? jsonArrayWithIndex : [{}],
              BucketPlanningFormattedDatesId: data.BucketId ? data.BucketId : 0
            }
    
            // Call save service
            const slotSaveService = this.saveLayoutService.slotSaveLayout(saveData)
              .subscribe({
                next: (res: any) => {
                  if (res.Table[0].SuccessMessage) {
                    this.toastr.success(res.Table[0].SuccessMessage, 'Success');
                  } else {
                    this.toastr.error(res.Table[0].ErrorMessage, 'Error');
                  }
                  this.getSlotData();
                },
                error: (error: any) => {
                  console.error('Save error:', error);
                  this.toastr.error("Some Error Occurred", "ERROR");
                }
              });
    
            this.dataDropped = false;
            this.subscribedService.push(slotSaveService);
          }
        }
        
      } catch (error) {
        console.error('Error in saveSlot:', error);
        this.toastr.error("Error saving slot configuration");
      }
    }
    
}
