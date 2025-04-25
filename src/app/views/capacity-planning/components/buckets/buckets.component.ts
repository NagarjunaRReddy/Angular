import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { StepChangedService } from '../../../../services/step-changed.service';
import { HelperService } from '../../../../services/helper.service';
import { Router } from '@angular/router';
import { SaveLayoutService } from '../../services/save-layout.service';
import { BucketsService } from '../../services/buckets.service';
import {
  BucketDeleteEntity,
  BucketPlanningFormattedDates,
  BucketSelectEntity,
} from '../../interfaces/buckets';
import {
  BucketSaveEntity,
  DropEntity,
  ISharedEntity,
} from '../../interfaces/capacity-planning-area';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AddEditBucketsComponent } from '../../models/add-edit-buckets/add-edit-buckets.component';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-buckets',
  templateUrl: './buckets.component.html',
  styleUrl: './buckets.component.scss',
})
export class BucketsComponent implements OnInit {
  menuAccess: any;
  menuData: any;
  capacity: any;

  @Input() public set BucketData(data: any) {
    if (data != undefined && data != null && data != '') {
      this.getBucketData();
      let slotData: any = {
        value: 0,
      };
      this.SlotEnable.emit(slotData);
    }
  }

  @Output() SlotEnable = new EventEmitter();
  selectedItems: any[] = []; // Array to store selected items
  searchInput: any = '';
  filteredList: any[] = [];
  bucketList: any[] = [];
  droppedList: any[] = [];
  bucketSelectedData: any[] = [];
  selectedDropBoxIndex: number = -1;
  loginInfo: any;
  subscribedService: Subscription[] = [];
  dataDropped: boolean = false;
  dropBoolean: boolean = true;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private stepChangeService: StepChangedService,
    private helper: HelperService,
    private router: Router,
    private bucketService: BucketsService,
    private saveLayoutService: SaveLayoutService
  ) {}

  ngOnInit(): void {
    try {
      // Parse and initialize login information from local storage
      this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
      this.capacity = JSON.parse(this.helper.getValue('Capacity'));
      // Parse and initialize menu data from local storage
      this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '[]');

      // Set menu access based on current route
      this.setMenuAccess();

      // Initialize bucket data
      this.getBucketData();
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      // Handle initialization errors appropriately
      this.toastr.error('Error initializing component', 'ERROR');
    }
  }

  /**
   * Sets menu access permissions based on the current route
   */
  setMenuAccess() {
    try {
      // Get current route URL
      let routerLink = this.router.url;

      // Filter menu access based on current route path
      this.menuAccess = this.menuData.filter((e: any) =>
        routerLink.includes(e.MenuPath)
      );

      // Debug logging
      console.log('Menu Access:', this.menuAccess);
      console.log('Router Link:', routerLink);
    } catch (error) {
      console.error('Error in setMenuAccess:', error);
      // Handle menu access setting errors
      this.toastr.error('Error setting menu access', 'ERROR');
    }
  }

  /**
   * Cleanup method to prevent memory leaks
   * Unsubscribes from all active subscriptions
   */
  ngOnDestroy(): void {
    try {
      // Unsubscribe from all subscriptions to prevent memory leaks
      this.subscribedService.forEach((element) => {
        if (element) {
          element.unsubscribe();
        }
      });
    } catch (error) {
      console.error('Error in ngOnDestroy:', error);
    }
  }

  /**
   * Fetches bucket data from the server based on current capacity
   */
  getBucketData() {
    try {
      // Get capacity data from local storage
      let data: any = JSON.parse(this.helper.getValue('capacity') || '{}');

      // Reset selected drop box index
      this.selectedDropBoxIndex = -1;

      // Prepare bucket selection entity
      const bucketData: BucketSelectEntity = {
        BucketId: 0,
        CapacityId: data.CapacityId ? data.CapacityId : 0,
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        Capacity: this.capacity ? this.capacity : '',
      };

      // Call service to get bucket data
      const bucketSelectService = this.bucketService
        .GetBucketData(bucketData)
        .subscribe(
          (res: any) => {
            console.log('Bucket Data Response:', res);

            // Handle Table data (Bucket List)
            if (res.Table != null && res.Table.length > 0) {
              // Set bucket list and create filtered copy
              this.bucketList = res.Table;
              console.log('Bucket List:', this.bucketList);
              this.filteredList = [...this.bucketList];
              console.log('Filtered List:', this.filteredList);
            } else {
              // Reset lists if no data
              this.bucketList = [];
              this.filteredList = this.bucketList; //new line
              this.filteredList = [...this.bucketList];
            }

            // Handle Table1 data (Dropped List)
            if (res.Table1 != null && res.Table1.length > 0) {
              // Set dropped list data
              this.droppedList = res.Table1;
              this.droppedList = [...res.Table1];
            } else {
              // Reset dropped list if no data
              this.droppedList = [];
            }

            // Handle Table2 data (Selected Bucket Data)
            if (res.Table2 != null && res.Table2.length > 0) {
              // Set selected bucket data
              this.bucketSelectedData = res.Table2;
            } else {
              // Reset selected bucket data if no data
              this.bucketSelectedData = [];
            }
          },
          (error: any) => {
            // Handle error in API call
            console.error('Error fetching bucket data:', error);
            this.toastr.error('Some Error Occurred', 'ERROR');
          }
        );

      // Store subscription for cleanup
      this.subscribedService.push(bucketSelectService);
    } catch (error) {
      // Handle any errors in the try block
      console.error('Error in getBucketData:', error);
      this.toastr.error('Error getting bucket data', 'ERROR');
    }
  }

  /**
   * Filters the list of buckets based on search input
   * @param event - Search text input
   */
  filterList(event: any) {
    try {
      let input = event.toLowerCase();

      // Reset to full list if search is empty
      if (input === '') {
        this.filteredList = this.bucketList;
      } else {
        // Filter based on formatted dates
        this.filteredList = this.bucketList.filter((item) =>
          item.FormattedDates.toLowerCase().includes(input)
        );
      }
    } catch (error) {
      console.error('Error in filterList:', error);
      this.toastr.error('Error filtering list items');
    }
  }

  /**
   * Toggles visibility of bucket item
   * @param event - Mouse event
   * @param item - Bucket item to toggle
   */
  toggleView(event: Event, item: any) {
    try {
      event.stopPropagation();
      this.dataDropped = true;

      // Toggle item visibility state
      item.IsHide = !item.IsHide;

      // Update step change data
      let stepChangeData = {
        dataChanged: true,
        step: 2,
      };
      this.stepChangeService.setPreviousStep(stepChangeData);
    } catch (error) {
      console.error('Error in toggleView:', error);
      this.toastr.error('Error toggling item visibility');
    }
  }

  /**
   * Handles selection/deselection of bucket items
   * @param index - Index of clicked item
   * @param rowData - Data of selected bucket
   */
  toggleBackgroundColor(index: number, rowData: any) {
    try {
      console.log('Selected bucket data:', rowData);

      // Get current capacity data
      let data: any = JSON.parse(this.helper.getValue('capacity') || '{}');

      if (this.selectedDropBoxIndex === index) {
        // Handle deselection
        this.selectedDropBoxIndex = -1;

        // Reset shared data
        let shareddata: ISharedEntity = {
          CapacityId: data.CapacityId ? data.CapacityId : 0,
          BucketId: 0,
        };
        this.helper.setValue('capacity', shareddata);

        // Emit slot disable event
        let slotData: any = {
          value: 0,
          name: rowData.FormattedDates,
        };
        this.SlotEnable.emit(slotData);
      } else {
        // Handle new selection
        this.selectedDropBoxIndex = index;

        // Update shared data
        let shareddata: ISharedEntity = {
          CapacityId: data.CapacityId ? data.CapacityId : 0,
          BucketId: rowData.BucketPlanningFormattedDatesId,
        };
        this.helper.setValue('capacity', shareddata);

        // Emit slot enable event
        let slotData: any = {
          value: 1,
          name: rowData.FormattedDates,
        };

        this.SlotEnable.emit(slotData);
      }
    } catch (error) {
      console.error('Error in toggleBackgroundColor:', error);
      this.toastr.error('Error selecting bucket');
    }
  }

  // Toggle selection on item click
  toggleSelection(item: any, event: Event) {
    event.stopPropagation(); // Prevent drag from triggering
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1); // Remove if already selected
    } else {
      this.selectedItems.push(item); // Add if not selected
    }
  }

  /**
   * Handles drag and drop operations
   * @param event - Drag drop event object
   */
  // Drop event - handle multiple items
  drop(event: CdkDragDrop<string[]>) {
    const data: any = JSON.parse(this.helper.getValue("capacity") ? this.helper.getValue("capacity") : "{}");
    if(this.menuAccess[0].EditAccess){
      if (event.previousContainer === event.container) {
        if (event.previousContainer.data == this.droppedList) {
          this.dataDropped = true;
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
          let stepChangeData = {
            dataChanged: true,
            step: 2
          }
          this.stepChangeService.setPreviousStep(stepChangeData);
        }
      } else {
        if (this.droppedList == event.previousContainer.data) {
          console.log( event.previousContainer.data[event.previousIndex]);
          
          let dropData: DropEntity = {
            CapacityId: data.CapacityId ? data.CapacityId : 0,
            bucketId: event.previousContainer.data[event.previousIndex]['BucketPlanningFormattedDatesId'],
            TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
            Flag: 2
          }
          const dropService = this.saveLayoutService.dropConfiguration(dropData)
            .subscribe((res: any) => {
              if (res.Table != undefined) {
                if (res.Table[0].Result != null) {
                  this.dropBoolean = false;
                }
                if (this.dropBoolean == true) {
                  if (this.selectedDropBoxIndex == event.previousIndex) {
                    this.selectedDropBoxIndex = -1; // Deselect if already selected
                    let shareddata: ISharedEntity = {
                      CapacityId: data.CapacityId ? data.CapacityId : 0,
                      BucketId: 0
                    }
                    this.helper.setValue("capacity", shareddata);
                    let slotData: any = {
                      value: 0,
                      name: event.previousContainer.data[event.previousIndex]['BucketName']
                    }
                    this.SlotEnable.emit(slotData);
                  }
                  this.dataDropped = true;
                  transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex,
                  );
                  let stepChangeData = {
                    dataChanged: true,
                    step: 2
                  }
                  this.stepChangeService.setPreviousStep(stepChangeData);
                }
                else {
                  this.toastr.warning("This Bucket is mapped in Slot", "Cant Remove");
                }
                this.dropBoolean = true;
              }
            },
              error => {
                this.toastr.error("Some error Occurred");
              });
          this.subscribedService.push(dropService);
        }
        else {
          if (data.CapacityId) {
            this.dataDropped = true;
            let selectedBuckets = this.selectedItems.length ? [...this.selectedItems] : [event.previousContainer.data[event.previousIndex]];
            selectedBuckets.forEach(bucket => {
              let index = event.previousContainer.data.findIndex(
                (item) => item === bucket
              );
              if (index !== -1) {
                transferArrayItem(
                  event.previousContainer.data,
                  event.container.data,
                  index,
                  event.currentIndex
                );
              }
            })
            // transferArrayItem(
            //   event.previousContainer.data,
            //   event.container.data,
            //   event.previousIndex,
            //   event.currentIndex,
            // );
            let stepChangeData = {
              dataChanged: true,
              step: 2
            }
            this.stepChangeService.setPreviousStep(stepChangeData);
          }
          else {
            this.toastr.warning('Select Capacity First', 'Cannot Drop');
          }
        }
      }
    }else{
      this.toastr.warning("You don't have the permission to perform this operation","WARNING")
    }
  }

  // Handle Drop Response
  private handleDropResponse(
    res: any,
    event: CdkDragDrop<string[]>,
    data: any,
    selectedBuckets: any[]
  ) {
    if (res.Table?.[0]?.Result !== null) {
      this.dropBoolean = false;
    }

    if (this.dropBoolean) {
      selectedBuckets.forEach((bucket) => {
        let index = event.previousContainer.data.findIndex(
          (item) => item === bucket
        );
        if (index !== -1) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            index,
            event.currentIndex
          );
        }
      });

      this.updateStepChange();
    } else {
      this.toastr.warning('This Bucket is mapped in Slot', "Can't Remove");
    }

    this.dropBoolean = true;
  }

  // Update Step Change
  private updateStepChange() {
    this.stepChangeService.setPreviousStep({ dataChanged: true, step: 2 });
  }

  /**
   * Opens a dialog to add a new bucket
   * @param event - The event that triggered this function
   */
  addBucket(event: Event) {
    try {
      event.stopPropagation();

      // Open dialog for adding a new bucket
      const dialogRef = this.dialog.open(AddEditBucketsComponent, {
        width: '40%', // Adjust the dialog width as needed
        data: {
          title: 'Add Bucket',
          button: 'Save',
          noteView: false,
        },
        disableClose: true, // Prevent closing the dialog by clicking outside
      });

      // Handle dialog closure
      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result === true) {
            this.getBucketData(); // Refresh bucket data after addition
          }
        })
        .catch((error) => {
          console.error('Error occurred:', error); // Log any errors
        });
    } catch (error) {
      console.error('Error in addBucket:', error);
      this.toastr.error('Error adding bucket');
    }
  }

  /**
   * Opens a dialog to edit an existing bucket
   * @param row - The data of the bucket to be edited
   * @param event - The event that triggered this function
   */
  editBucket(row: any, event: Event) {
    try {
      console.log(row, 'editrow');
      event.stopPropagation();

      // Open dialog for editing the existing bucket
      const dialogRef = this.dialog.open(AddEditBucketsComponent, {
        width: '40%', // Adjust the dialog width as needed
        data: {
          title: 'Update Bucket',
          button: 'Update',
          value: row,
          noteView: false,
        },
        disableClose: true,
      });

      // Handle dialog closure
      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result === true) {
            this.getBucketData(); // Refresh bucket data after edit
          }
        })
        .catch((error) => {
          console.error('Error occurred:', error); // Log any errors
        });
    } catch (error) {
      console.error('Error in editBucket:', error);
      this.toastr.error('Error editing bucket');
    }
  }

  /**
   * Opens a dialog to edit notes of an existing bucket
   * @param row - The data of the bucket for which the note will be edited
   * @param event - The event that triggered this function
   */
  editNote(row: any, event: Event) {
    try {
      event.stopPropagation();

      // Open dialog for editing notes
      const dialogRef = this.dialog.open(AddEditBucketsComponent, {
        width: '32%', // Adjust the dialog width as needed
        data: {
          title: 'Note',
          button: 'Save',
          value: row,
          noteView: true,
        },
        disableClose: true,
      });

      // Handle dialog closure
      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          if (result === true) {
            this.getBucketData(); // Refresh bucket data after note edit
          }
        })
        .catch((error) => {
          console.error('Error occurred:', error); // Log any errors
        });
    } catch (error) {
      console.error('Error in editNote:', error);
      this.toastr.error('Error editing note');
    }
  }

  /**
   * Deletes a bucket after confirmation
   * @param row - The data of the bucket to be deleted
   * @param event - The event that triggered this function
   */
  deleteBucket(row: any, event: Event) {
    try {
      if (this.dataDropped) {
        this.toastr.warning('Save Changes Before Deleting.', 'Close');
      } else {
        event.stopPropagation();

        // Open confirmation dialog
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '30%', // Adjust the dialog width as needed
          data: {
            title: 'Confirm Action',
            message: 'Are you sure you want to delete?',
          },
        });

        // Handle confirmation dialog result
        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            const bucketData: BucketDeleteEntity = {
              BucketId: row.BucketPlanningFormattedDatesId,
              TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
            };

            console.log(bucketData, 'bucketData');

            // Call service to delete the bucket
            const bucketDeleteService = this.bucketService
              .BucketDelete(bucketData)
              .subscribe(
                (res: any) => {
                  if (res.Table[0].SuccessMessage) {
                    this.toastr.success(res.Table[0].SuccessMessage, 'Success');
                  } else {
                    this.toastr.error(res.Table[0].ErrorMessage, 'Error');
                  }
                  this.getBucketData(); // Refresh bucket data after deletion
                },
                (error: any) => {
                  this.toastr.error('Some Error Occurred', 'ERROR');
                }
              );
            this.subscribedService.push(bucketDeleteService); // Store the subscription for later cleanup
          }
        });
      }
    } catch (error) {
      console.error('Error in deleteBucket:', error);
      this.toastr.error('Error deleting bucket');
    }
  }

  /**
   * Saves the current bucket layout
   */
  saveBucket() {
    if (this.dataDropped) {
      let stepChangeData = {
        dataChanged: false,
        step: 2
      }
      this.stepChangeService.setPreviousStep(stepChangeData);
    if (this.droppedList != undefined) {
      // Prepare data with index for saving
      const jsonArrayWithIndex = this.droppedList.map((jsonObj, index) => {
        jsonObj.index = index;
        return jsonObj;
      });

      let data: any = JSON.parse(this.helper.getValue('capacity') || '{}');

      // Prepare save data
      let saveData: BucketSaveEntity = {
        flag: 2,
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        CapacityId: data.CapacityId ? data.CapacityId : 0,
        CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
        JsonData: this.droppedList.length > 0 ? jsonArrayWithIndex : [{}],
      };

      // Call service to save bucket layout
      const bucketSaveService = this.saveLayoutService
        .bucketSaveLayout(saveData)
        .subscribe(
          (res: any) => {
            if (res.Table[0].SuccessMessage) {
              this.toastr.success(res.Table[0].SuccessMessage, 'Success');
              let stepChangeData = {
                dataChanged: false,
                step: 2,
              };
              this.stepChangeService.setPreviousStep(stepChangeData);
            } else {
              this.toastr.error(res.Table[0].ErrorMessage, 'Error');
            }
            this.getBucketData(); // Refresh bucket data after save
          },
          (error: any) => {
            this.toastr.error('Some Error Occurred', 'ERROR');
          }
        );

      this.dataDropped = false; // Reset data dropped status
      this.subscribedService.push(bucketSaveService); // Store the subscription for cleanup
    }
  }
  }
}
