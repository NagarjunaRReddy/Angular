import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AddEditCapacityAreaComponent } from '../../models/add-edit-capacity-area/add-edit-capacity-area.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CapacityAreaDeleteEntity,
  CapacityAreaSaveEntity,
  CapacityAreaSelectEntity,
  DropEntity,
  ISharedEntity,
} from '../../interfaces/capacity-planning-area';
import { CapacityAreaService } from '../../services/capacity-area.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { StepChangedService } from '../../../../services/step-changed.service';
import { SaveLayoutService } from '../../services/save-layout.service';
import { HelperService } from '../../../../services/helper.service';

@Component({
  selector: 'app-capacity-area',
  templateUrl: './capacity-area.component.html',
  styleUrl: './capacity-area.component.scss',
})
export class CapacityAreaComponent implements OnInit {
  filteredList: any[] = [];
  capacityAreaList: any[] = [];
  selectedDropBoxIndex: number = -1;
  subscribedService: Subscription[] = [];
  loginInfo: any;
  dataDragged: boolean = false;
  capacityAreaSelectedData: any[] = [];
  dropBoolean: boolean = true;
  searchInput: any = '';
  menuData: any;
  menuAccess: any;

  droppedList: any[] = [];
  @Output() BucketEnable = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private capacityService: CapacityAreaService,
    private toastr: ToastrService,
    private router: Router,
    private stepChangeService: StepChangedService,
    private saveLayoutService: SaveLayoutService,
    private helper: HelperService
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');
    this.helper.setValue("capacity", {});
    this.getCapacityAreaData();
  }
  filterList(event: any) {
    try {
      let input = event.toLowerCase(); // Convert input to lowercase for case-insensitive comparison

      // If the input is empty, display all capacity areas
      if (input === '') {
        this.filteredList = this.capacityAreaList; // Show all items
      } else {
        // Otherwise, filter the capacity areas based on the input
        this.filteredList = this.capacityAreaList.filter(
          (item) => item.CapacityName.toLowerCase().includes(input) // Check if capacity name includes input
        );
      }
    } catch (error) {
      console.error('Error filtering list:', error); // Log any errors encountered during filtering
    }
  }

  setMenuAccess() {
    try {
      // Get the current URL to determine the active route
      let routerLink = this.router.url;

      // Filter menu access based on the current route
      this.menuAccess = this.menuData.filter((e: any) =>
        routerLink.includes(e.MenuPath)
      );
    } catch (error) {
      console.error('Error setting menu access:', error); // Log any errors that occur while setting menu access
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    try {
      // Check if the user has edit access before proceeding
      if (event.previousContainer === event.container) {
        // Ensure the previous container data matches the dropped list
        if (event.previousContainer.data == this.droppedList) {
          this.dataDragged = true; // Set dataDragged to true indicating a change

          // Move the item within the same array
          moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );

          // Notify the step change service about the data change
          let stepChangeData = {
            dataChanged: true,
            step: 1,
          };
          this.stepChangeService.setPreviousStep(stepChangeData);
        }
      } else {
        // Check if the item is being moved from the dropped list
        if (event.previousContainer.data == this.droppedList) {
          // Prepare data to be sent to the server
          let dropData: DropEntity = {
            CapacityId: event.previousContainer.data[event.previousIndex]['Id'], // Get the ID of the capacity being moved
            TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Use Tenant ID from login info
            Flag: 1,
            bucketId: 0,
            SlotId: 0,
          };

          // Call the service to update the configuration
          const dropService = this.saveLayoutService
            .dropConfiguration(dropData)
            .subscribe(
              (res: any) => {
                if (res.Table != undefined) {
                  if (res.Table[0].Result != null) {
                    this.dropBoolean = false; // Mark dropBoolean as false based on result
                  }

                  // If dropBoolean is true, proceed with the drop action
                  if (this.dropBoolean == true) {
                    // Check if the currently selected drop box is the one being dragged from
                    if (this.selectedDropBoxIndex == event.previousIndex) {
                      // Reset shared data for capacity
                      let shareddata: ISharedEntity = {
                        CapacityId: 0, // Reset Capacity ID
                      };
                      this.helper.setValue('capacity', shareddata);

                      // Prepare bucket data to emit
                      let bucketData: any = {
                        value: 0, // Indicates no capacity is selected
                        // name: event.previousContainer.data[event.previousIndex]['CapacityName']
                      };
                      this.BucketEnable.emit(bucketData); // Emit event to update bucket state
                      this.selectedDropBoxIndex = -1; // Deselect if already selected
                    }

                    this.dataDragged = true; // Set dataDragged to true indicating a change

                    // Move the item to the new container
                    transferArrayItem(
                      event.previousContainer.data,
                      event.container.data,
                      event.previousIndex,
                      event.currentIndex
                    );

                    // Notify the step change service about the data change
                    let stepChangeData = {
                      dataChanged: true,
                      step: 1,
                    };
                    this.stepChangeService.setPreviousStep(stepChangeData);
                  } else {
                    // Notify user if the capacity area cannot be removed
                    this.toastr.warning(
                      'This Capacity Area is mapped in Bucket',
                      "Can't Remove"
                    );
                  }

                  this.dropBoolean = true; // Reset dropBoolean
                }
              },
              (error) => {
                // Handle error during the service call
                this.toastr.error('Some error occurred');
                console.error('Error during drop configuration:', error); // Log the error for debugging
              }
            );

          // Store the subscription to prevent memory leaks
          this.subscribedService.push(dropService);
        } else {
          // When dropped from a different container
          this.dataDragged = true; // Set dataDragged to true indicating a change

          // Move the item between two different containers
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );

          // Notify the step change service about the data change
          let stepChangeData = {
            dataChanged: true,
            step: 1,
          };
          this.stepChangeService.setPreviousStep(stepChangeData);
        }
      }
    } catch (error) {
      // Handle any errors that occur during the drop operation
      console.error('Error in drop operation:', error); // Log the error for debugging
    }
  }

  addCapacity(event: Event) {
    try {
      event.stopPropagation(); // Prevent event from bubbling up to parent elements

      // Open the dialog for adding a capacity area
      const dialogRef = this.dialog.open(AddEditCapacityAreaComponent, {
        width: '32%', // Set the width of the dialog
        data: {
          title: 'Add Capacity Area', // Title for the dialog
          button: 'Save', // Text for the save button
        },
        disableClose: true, // Prevent closing the dialog by clicking outside
      });

      // Handle the dialog's close event
      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          // If the dialog returns true, refresh the capacity area data
          if (result == true) {
            this.getCapacityAreaData();
          }
        })
        .catch((error) => {
          // Log any errors that occur while closing the dialog
          console.error('Error occurred:', error);
        });
    } catch (error) {
      console.error('Error in addCapacity:', error); // Log any errors in adding capacity
    }
  }

  getCapacityAreaData() {
    try {
      // Prepare the data object for the service call
      let capacityAreaData: CapacityAreaSelectEntity = {
        CapacityId: 0, // Default capacity ID
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Use Tenant ID from login info, default to 0 if not available
      };

      // Call the service to fetch capacity area data
      const capacityAreaSelectService = this.capacityService
        .capacityAreaSelect(capacityAreaData)
        .subscribe(
          (res: any) => {
            // On successful response
            // Check if the response contains capacity areas
            if (res.Table != null && res.Table.length > 0) {
              this.capacityAreaList = res.Table; // Set the capacity area list from the response
              this.filteredList = this.capacityAreaList; // Initialize filtered list
              this.filteredList = [...this.filteredList]; // Create a copy of the filtered list
            } else {
              // If no capacity areas found, initialize as empty
              this.capacityAreaList = [];
              this.filteredList = this.capacityAreaList;
              this.filteredList = [...this.filteredList]; // Ensure filtered list is also empty
            }

            // Check if there are dropped list items in the response
            if (res.Table1 != null && res.Table1.length > 0) {
              this.droppedList = res.Table1; // Set the dropped list from the response
              this.droppedList = [...this.droppedList]; // Create a copy of the dropped list
            } else {
              this.droppedList = []; // Initialize dropped list as empty if not found
            }

            // Check if there's selected capacity area data in the response
            if (res.Table2 != null && res.Table2.length > 0) {
              this.capacityAreaSelectedData = res.Table2; // Set selected capacity area data
            } else {
              this.capacityAreaSelectedData = []; // Initialize selected data as empty if not found
            }
          },
          (error: any) => {
            // Handle errors gracefully
            this.toastr.error('Some Error Occurred', 'ERROR'); // Show error notification
            console.error('Error fetching capacity area data:', error); // Log the error for debugging
          }
        );

      // Store the subscription to prevent memory leaks
      this.subscribedService.push(capacityAreaSelectService);
    } catch (error) {
      console.error('Error in getCapacityAreaData:', error); // Log errors during method execution
    }
  }
  deleteCapacity(row: any, event: Event) {
    try {
      // Check if there are unsaved changes before allowing deletion
      if (this.dataDragged) {
        this.toastr.warning('Save Changes Before Deleting.', 'Warning');
      } else {
        event.stopPropagation(); // Prevent event from bubbling up to parent elements

        // Open confirmation dialog for deletion
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '30%', // Set the width of the dialog
          data: {
            title: 'Confirm Action', // Title for the dialog
            message: 'Are you sure you want to delete?', // Message for confirmation
          },
        });

        // Handle the result of the confirmation dialog
        dialogRef.afterClosed().subscribe((result) => {
          // If the user confirms, proceed to delete
          if (result == true) {
            let capacityAreaData: CapacityAreaDeleteEntity = {
              CapacityId: row.Id, // Set the ID of the capacity area to delete
              TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Obtain tenant ID
            };

            // Call the service to delete the capacity area
            const capacityAreaDeleteService = this.capacityService
              .capacityAreaDelete(capacityAreaData)
              .subscribe(
                (res: any) => {
                  // Handle the successful response
                  if (res.Table[0].SuccessMessage) {
                    this.toastr.success(res.Table[0].SuccessMessage, 'Success'); // Show success message
                  } else {
                    this.toastr.error(res.Table[0].ErrorMessage, 'Error'); // Show error message
                  }
                  this.getCapacityAreaData(); // Refresh the capacity area data after deletion
                },
                (error: any) => {
                  this.toastr.error('Some Error Occurred', 'ERROR'); // Show error notification on failure
                  console.error('Error deleting capacity area:', error); // Log error
                }
              );

            this.subscribedService.push(capacityAreaDeleteService); // Prevent memory leaks by storing the subscription
          }
        });
      }
    } catch (error) {
      console.error('Error in deleteCapacity:', error); // Log any errors encountered during deletion
    }
  }
  editCapacity(row: any, event: Event) {
    try {
      event.stopPropagation(); // Prevent event from bubbling up to parent elements

      // Open the dialog for editing a capacity area
      const dialogRef = this.dialog.open(AddEditCapacityAreaComponent, {
        width: '32%', // Set the width of the dialog
        data: {
          title: 'Update Capacity Area', // Title for the dialog
          button: 'Update', // Text for the update button
          value: row, // Pass the current row data for editing
        },
        disableClose: true, // Prevent closing the dialog by clicking outside
      });

      // Handle the dialog's close event
      dialogRef
        .afterClosed()
        .toPromise()
        .then((result) => {
          // If the dialog returns true, refresh the capacity area data
          if (result == true) {
            this.getCapacityAreaData();
          }
        })
        .catch((error) => {
          // Log any errors that occur while closing the dialog
          console.error('Error occurred:', error);
        });
    } catch (error) {
      console.error('Error in editCapacity:', error); // Log any errors in editing capacity
    }
  }
  toggleBackgroundColor(index: number, rowData: any) {
    try {
      // Check if the clicked index is already selected
      if (this.selectedDropBoxIndex === index) {
        this.selectedDropBoxIndex = -1; // Deselect if already selected

        let shareddata: ISharedEntity = {
          CapacityId: 0, // Reset Capacity ID to 0
        };

        this.helper.setValue('capacity', shareddata); // Clear any previously stored capacity data

        let bucketData: any = {
          value: 0, // Indicates no capacity is selected
          name: rowData.CapacityName, // Keep the name of the deselected item
        };

        this.BucketEnable.emit(bucketData); // Emit event to update bucket state
      } else {
        this.selectedDropBoxIndex = index; // Select the clicked drop-box

        let shareddata: ISharedEntity = {
          CapacityId: rowData.Id, // Set Capacity ID from the selected row data
        };

        this.helper.setValue('capacity', shareddata); // Store selected capacity data

        let bucketData: any = {
          value: 1, // Indicates that a capacity is selected
          name: rowData.CapacityName, // Keep the name of the selected item
        };

        this.BucketEnable.emit(bucketData); // Emit event to update bucket state
      }
    } catch (error) {
      console.error('Error toggling background color:', error); // Log any errors encountered during toggle
    }
  }
  saveCapacity() {
    try {
      // Check if there were changes made
      if (this.dataDragged) {
        let stepChangeData = {
          dataChanged: false, // Set dataChanged to false as we are saving
          step: 1,
        };

        // Notify the step change service about the data change
        this.stepChangeService.setPreviousStep(stepChangeData);

        // Proceed if the dropped list is defined
        if (this.droppedList != undefined) {
          // Map dropped list items to include their index
          const jsonArrayWithIndex = this.droppedList.map((jsonObj, index) => {
            jsonObj.index = index; // Assign index to each object
            return jsonObj; // Return modified object
          });

          // Prepare data for saving
          let saveData: CapacityAreaSaveEntity = {
            flag: 1,
            TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, // Obtain tenant ID
            CreatedBy: this.loginInfo.CreatedBy ? this.loginInfo.CreatedBy : 0, // Obtain creator ID
            JsonData: this.droppedList.length > 0 ? jsonArrayWithIndex : [{}], // Prepare JSON data
          };

          // Call the service to save the layout
          const CapacityAreaSaveService = this.saveLayoutService
            .capacityAreaSaveLayout(saveData)
            .subscribe(
              (res: any) => {
                // Handle the successful response
                if (res.Table[0].SuccessMessage) {
                  this.toastr.success(res.Table[0].SuccessMessage, 'Success'); // Show success message
                } else {
                  this.toastr.error(res.Table[0].ErrorMessage, 'Error'); // Show error message
                }
                this.getCapacityAreaData(); // Refresh the capacity area data
              },
              (error: any) => {
                this.toastr.error('Some Error Occurred', 'ERROR'); // Show error notification on failure
                console.error('Error saving capacity area:', error); // Log error
              }
            );

          this.dataDragged = false; // Reset dataDragged after saving
          this.subscribedService.push(CapacityAreaSaveService); // Prevent memory leaks by storing the subscription
        }
      }
    } catch (error) {
      console.error('Error in saveCapacity:', error); // Log any errors encountered during saving
    }
  }
}
