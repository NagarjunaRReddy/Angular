import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionResponsibleService } from '../../../services/action-responsible.service';
import { ActionStatusService } from '../../../services/action-status.service';
import { HelperService } from '../../../../../services/helper.service';
import { ProductionPlanningService } from '../../../services/production-planning.service';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';
import { IProductionPlanActionInsertUpdate } from '../../../interfaces/production-sop';


@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  form: FormGroup;
  loginInfo: any;
  responsibleList: any[] = [];
  filterResponsibleLists: any[] = [];
  actionStatusList: any;

  // Input properties for receiving data from parent component
  @Input() actionData: any;
  @Input() soNumber: any;
  @Input() commonTableData: any;

  constructor(
    private fb: FormBuilder,
    private actionService: ActionResponsibleService,
    private actionStatusService: ActionStatusService,
    private helper: HelperService,
    private dialog:MatDialog,
    private productionService: ProductionPlanningService,
    private toastr:ToastrService,
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
    await this.getActionStatus();
    // Clear existing items before adding new ones
    this.items.clear();
  
    // Initialize the form with existing data if actionData is provided
    if (this.actionData && this.actionData.length > 0) {
      // Add form groups for each item in actionData
      this.actionData.slice(0, this.actionData.length).forEach(data => {
        this.items.push(
          this.fb.group({
            actionIdentified: [data.actionName, Validators.required],
            responsible: [data.responsibleId, Validators.required],
            actionIdentifiedDate: [data.actionIdentifiedDate, Validators.required],
            targetDate: [data.TargetDate, Validators.required],
            status: [data.statusId, Validators.required],
          })
        );
      });
  
      // If actionData has fewer than 5 items, add additional form groups to meet a minimum count of 5
      for (let i = this.actionData.length; i < 5; i++) {
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
    for (let i = 0; i < this.items.length; i++) {
      this.filterResponsibleLists[i] = this.responsibleList.slice(); // Initialize with a copy of responsibleList
    }
  }

  // Function to fetch responsible data
  getResponsibleData() {
    let data = {
      actionResponsibleId: 0,
      tenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.actionService.getAction(data).subscribe((res: any) => {
      //console.log(res);
      this.responsibleList = res;
      this.filterResponsibleLists = res.map(() => res);
    });
  }

  // Function to fetch action status data
  getActionStatus() {
    let data = {
      ActionStatusId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    this.actionStatusService.getAction(data).subscribe((res: any) => {
      //console.log(res);
      this.actionStatusList = res;
    });
  }

  // Function to add a new item to the form array
  addItem() {
    const newItem = this.fb.group({
      slNo: [null, Validators.required],
      actionIdentified: [null, Validators.required],
      responsible: [null, Validators.required],
      actionIdentifiedDate: [null, Validators.required],
      targetDate: [null, Validators.required],
      status: [null, Validators.required],
    });

    this.items.push(newItem);

    // Initialize filtered responsible list for the new item
    this.filterResponsibleLists.push(this.responsibleList);
  }

  // Function to remove an item from the form array by index
  removeItem(index: number) {
    //console.log(this.form.value.items[index]);
    let clickData = this.form.value.items[index];
    if(clickData.actionIdentified || clickData.responsible || clickData.status || clickData.targetDate){
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '30%', // Adjust the width as needed
        data: {
          title: 'Confirm Action',
          message: 'Are you sure want to delete the data?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.items.removeAt(index);
          this.filterResponsibleLists.splice(index, 1); // Remove the filtered responsible list for the deleted item
        }
      });
    }else{
      this.items.removeAt(index);
      this.filterResponsibleLists.splice(index, 1); // Remove the filtered responsible list for the deleted item
    }
  }

  // Getter function to access the 'items' form array
  get items() {
    return this.form.get('items') as FormArray;
  }

  // Function to handle form submission
  onSubmit() {
    // Retrieve form values
    const formValue = this.form.value;
    //console.log(formValue);
    if (formValue.items) {
      formValue.items.forEach(item => {
        if (item.targetDate || item.actionIdentifiedDate) {
          item.targetDate = this.datePipe.transform(item.targetDate, 'dd-MMM-yyyy');
          item.actionIdentifiedDate = this.datePipe.transform(item.actionIdentifiedDate, 'dd-MMM-yyyy');
        }
      });
    }

    // Filter out items with null responsible or actionIdentified values
    let finalJson = formValue.items.filter((e) => e.responsible != null && e.actionIdentified != null);
    //console.log(finalJson);

    // Construct data for API request
    let data: IProductionPlanActionInsertUpdate = {
      JsonData: JSON.stringify(finalJson),
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      soNumber: this.soNumber,
      Createdby: this.loginInfo.UserId ? this.loginInfo.UserId : 0,
    };

    // API request to insert or update production planning actions
    this.productionService.productionPlanningActionInsertUpdate(data).subscribe((res: any) => {
      //console.log(res);
      // Additional logic after the API response can be placed here
      if(res[0].SuccessMessage){
        this.toastr.success(res[0].SuccessMessage,"Success");
      }else{
        this.toastr.error(res[0].ErrorMessage,"Error");
      }
    });
  }

  // Function to filter action responsible list for each item
  filterActions(index: number, value: any){
    this.filterResponsibleLists[index] = this.responsibleList.filter((e:any) => e.ActionResponsibleName.toLowerCase().includes(value.toLowerCase()) );
  }

  cancelChange(){
    this.ngOnInit();
  }
}
