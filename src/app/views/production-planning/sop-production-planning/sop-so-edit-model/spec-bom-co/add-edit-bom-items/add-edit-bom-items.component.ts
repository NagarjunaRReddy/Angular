import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionResponsibleService } from '../../../../services/action-responsible.service';
import { HelperService } from '../../../../../../services/helper.service';
import { BomService } from '../../../../services/bom.service';
import { ProductionPlanningService } from '../../../../services/production-planning.service';
import { ConfirmDialogComponent } from '../../../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-edit-bom-items',
  templateUrl: './add-edit-bom-items.component.html',
  styleUrls: ['./add-edit-bom-items.component.scss']
})
export class AddEditBomItemsComponent  implements OnInit {

  form: FormGroup;
  loginInfo: any;
  responsibleList: any[] = [];
  filterResponsibleLists: any[] = [];
  actionStatusList: any;
  bomStatusList:any[]=[];
  filteredBomStatusList:any[]=[];

  constructor(
    public dialogRef: MatDialogRef<AddEditBomItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private actionService: ActionResponsibleService,
    private helper: HelperService,
    private dialog:MatDialog,
    private toastr:ToastrService,
    private bomStatusServce:BomService,
    private productionServce:ProductionPlanningService,
    private datePipe:DatePipe
  ) {
    // Initializing the form with form array
    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    if (changes['actionData']) {
      this.ngOnInit();
    }
  }

  async ngOnInit() {
    // Log the received actionData
    //console.log(this.actionData);
  
    // Parse login information from the helper service
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
  
    await this.getResponsibleData();
    await this.getBomStatusData();
    // Clear existing items before adding new ones
    this.items.clear();
  
    // Initialize the form with existing data if actionData is provided
    if (this.data?.tableData && this.data?.tableData.length > 0) {
      // Add form groups for each item in actionData
      this.data.tableData.slice(0, this.data?.tableData.length).forEach((data:any) => {
        this.items.push(
          this.fb.group({
            itemDesc: [data?.itemDesc],
            responsible: [data?.responsible],
            quantity: [data?.quantity],
            status: [data?.statusId],
            comment: [data?.comment],
          })
        );
      });
  
      // If actionData has fewer than 5 items, add additional form groups to meet a minimum count of 5
      for (let i = this.data.tableData.length; i < 5; i++) {
        this.addItem();
      }
    } else {
      // Initialize the form with 5 form groups
      for (let i = 0; i < 5; i++) {
        this.addItem();
      }
    }
  
    // Initialize filtered responsible lists for each form control
    this.initializeFilteredResponsibleLists();
  }
  

  initializeFilteredResponsibleLists() {
    this.filterResponsibleLists = [];
    this.filteredBomStatusList = []
    for (let i = 0; i < this.items.length; i++) {
      this.filterResponsibleLists[i] = this.responsibleList.slice(); // Initialize with a copy of responsibleList
      this.filteredBomStatusList[i] = this.bomStatusList.slice(); // Initialize with a copy of BOMList
    }
  }

  // Function to fetch responsible data
  async getResponsibleData() {
    let data = {
      actionResponsibleId: 0,
      tenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.actionService.getAction(data).subscribe((res: any) => {
      this.responsibleList = res;
      this.filterResponsibleLists = res.map(() => res);
    });
  }

  // Function to fetch BOM Status data
  async getBomStatusData() {
    let data = {
      BOMStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.bomStatusServce.GetBom(data).subscribe((res: any) => {
      this.bomStatusList = res;
      this.filteredBomStatusList = res.map(()=> res);
    });
  }

  // Function to add a new item to the form array
  addItem() {
    const newItem = this.fb.group({
      slNo: [null],
      itemDesc: [""],
      quantity: [0],
      responsible: [0],
      status: [0],
      comment: [""],
    });

    this.items.push(newItem);

    // Initialize filtered responsible list for the new item
    this.filterResponsibleLists.push(this.responsibleList);
    this.filteredBomStatusList.push(this.bomStatusList);
  }

  // Function to remove an item from the form array by index
  removeItem(index: number) {
    let clickData = this.form.value.items[index];
    if(clickData.itemDesc || clickData.responsible || clickData.status){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '30%', // Adjust the width as needed
        data: {
          title: 'Confirm Action',
          message: 'Are you sure want to delete the data?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.items.removeAt(index);
          this.filterResponsibleLists.splice(index, 1); // Remove the filtered responsible list for the deleted item
          this.filteredBomStatusList.splice(index, 1); // Remove the filtered BOM list for the deleted item
        }
      });
    }else{
      this.items.removeAt(index);
      this.filterResponsibleLists.splice(index, 1); // Remove the filtered responsible list for the deleted item
      this.filteredBomStatusList.splice(index, 1); // Remove the filtered BOM list for the deleted item
    }
  }

  // Getter function to access the 'items' form array
  get items() {
    return this.form.get('items') as FormArray;
  }

  // Function to handle form submission
  onSubmit() {
    console.log(this.items);
    let data = {
      jsonData:JSON.stringify(this.items.value),
      tenantId:this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      createdBy:this.loginInfo.UserId ? this.loginInfo.UserId : 0,
      soNumber:this.data.soNumber
    }

    this.productionServce.productionPlanningBomItemInsertUpdate(data).subscribe(
      (res: any) => {
        try {
          if (res[0]?.SuccessMessage) {
            this.toastr.success(res[0].SuccessMessage, "SUCCESS");
            this.dialogRef.close(JSON.parse(res[0].bomItemDetails))
          } else {
            this.toastr.error(res[0].ErrorMessage, "ERROR");
          }
        } catch (error) {
          console.error('Error processing response:', error);
          this.toastr.error('An unexpected error occurred.', 'ERROR');
        }
      },
      (error) => {
        console.error('Error in HTTP request:', error);
        this.toastr.error('Failed to communicate with the server. Please try again later.', 'ERROR');
      }
    );
    
    
  }

  // Function to filter action responsible list for each item
  filterActions(index: number, value: any){
    this.filterResponsibleLists[index] = this.responsibleList.filter((e:any) => e.ActionResponsibleName.toLowerCase().includes(value.toLowerCase()) );
  }

  cancelChange(){
    this.ngOnInit();
  }
  
  onCancel(){
    this.dialogRef.close();
  }

}
