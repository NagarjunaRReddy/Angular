import { Component, OnInit } from '@angular/core';
import { AxSoDetailsModelComponent } from './ax-so-details-model/ax-so-details-model.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HelperService } from '../../../services/helper.service';
import { ProductionPlanningService } from '../services/production-planning.service';


@Component({
  selector: 'app-ax-production-planning',
  templateUrl: './ax-production-planning.component.html',
  styleUrls: ['./ax-production-planning.component.scss']
})
export class AxProductionPlanningComponent implements OnInit {

  activeView:any='setting';
  axData:any[]=[];
  axDataCopy:any[]=[];
  selectedCapacityId:any;
  slotList:any[]=[]
  loginInfo: any;
  searchQuery: string = '';
  filterSopList: any[] = [];
  soList: any[] = [];
  soFilterInputValue: string = '';

  constructor(private dialog:MatDialog, private route: ActivatedRoute,private helper:HelperService, private productionService:ProductionPlanningService){
    this.route.params.subscribe(params => {
      const data = params['id'];
      this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
      this.selectedCapacityId = data;
      this.getAxPlanningData(this.selectedCapacityId)
      console.log('Data received:', data);
      if(this.axData.length !=0){
        const weekWithMaxSlotClasses = this.findWeekWithMaxSlotClasses(this.axData);
        
        if (weekWithMaxSlotClasses) {
          this.slotList = this.createSlotArray(weekWithMaxSlotClasses);
        }
      }
    });
  }

  ngOnInit(): void {
    console.log(this.slotList);
  }

  getAxPlanningData(capacityId:any){
    let data = {
      capacityId:capacityId,
      tenantID:this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      site:JSON.parse(this.helper.getValue('capacityName'))
    }
    this.productionService.getProductionAX(data).subscribe((res:any)=>{
      console.log(res);
      this.soList=JSON.parse(res[0].soDetails);
      this.axData = JSON.parse(res[0].tableDetails)?? []; //.map(item => ({ ...item }));
      this.axData.forEach(item => {
        if (item.SlotPlanning) {
          item.SlotPlanning = JSON.parse(item.SlotPlanning);
        }
      });
      if(this.axData.length !=0){
        const weekWithMaxSlotClasses = this.findWeekWithMaxSlotClasses(this.axData);
        
        if (weekWithMaxSlotClasses) {
          this.slotList = this.createSlotArray(weekWithMaxSlotClasses);
        }
      }
      console.log(this.axData,'Final-ax-data');
     // this.filterColumn();
     this.axDataCopy=this.axData;
     this.filterSopList=this.soList;
    })

    
  }


  filterSoList(event: any) {
    let value = event.target.value.toLowerCase();
    this.filterSopList = this.soList.filter((item: any) =>
      item.soNumber.toLowerCase().includes(value)
    );
  }

  changeView(view:any){
    this.activeView = view;
  }

  findWeekWithMaxSlotClasses(data: any[]): any {
    let maxWeek = null;
    let maxSlotClasses = 0;

    for (const week of data) {
      const numSlotClasses = week.SlotPlanning.length;

      if (numSlotClasses > maxSlotClasses) {
        maxSlotClasses = numSlotClasses;
        maxWeek = week;
      }
    }

    return maxWeek;
  }

  filterSlotsBySoNumberAndLength(finalSopData?: any, soNumber?: string): any {
    // Filter slots by soNumber
    return finalSopData.filter(bucket => {
      const hasMatchingSoNumber = bucket.SlotPlanning.some(order => {
          const soNumberLowerCase = (order.soNumber || '').toLowerCase(); // Null check added here
          const customerNameLowerCase = (order.customerName || '').toLowerCase(); // Null check added here
          const dealerNameLowerCase = (order.businessUnit || '').toLowerCase(); // Null check added here
          const subCategoryNameLowerCase = (order.subCategoryName || '').toLowerCase(); // Null check added here
  
          return (
            soNumberLowerCase.includes(soNumber?.toLowerCase() || '') || 
            customerNameLowerCase.includes(soNumber?.toLowerCase() || '') || 
            dealerNameLowerCase.includes(soNumber?.toLowerCase() || '') ||
            subCategoryNameLowerCase.includes(soNumber?.toLowerCase() || '')
          );
        });
      
     // const hasNonEmptySoList = bucket.SlotPlanning.some(slot => slot.SoList.length > 0);
      return hasMatchingSoNumber //&& hasNonEmptySoList;
    });
  }



  filterColumn()
  {
   // this.searchQuery ='Bent Tree';
    console.log("Search query:", this.searchQuery);
    if(this.searchQuery !='')
    {
      const filteredSlots = this.filterSlotsBySoNumberAndLength(this.axDataCopy, this.searchQuery);
      this.axData=filteredSlots;
      //this.searchResult=true;
      console.log(this.axData,'Filterd data');
      
    }
    else{
       this.axData=this.axDataCopy;
       //this.searchResult=false;axDataCopy
    }
  }













  createSlotArray(week: any): string[] {
    const slotArray: string[] = [];
    for (let i = 1; i <= week.SlotPlanning.length; i++) {
      slotArray.push(`Slot ${i}`);
    }
    return slotArray;
  }

  setSlotColor(status) {
    const colorMap = {
      'None': 'red-bg',
      '': 'blue-bg',
      null: 'blue-bg',
      'Reserved On Site': 'green-bg',
      'Received On Site': 'green-bg',
      'Completed': 'green-bg',
      'Ordered': 'yellow-bg',
    };
  
    return colorMap[status] || 'default-bg';
  }

  getDisplayedValue(slot: any): string {
    switch (this.activeView) {
      case 'home':
        return slot.soNumber;
      case 'user':
        return slot.customerName;
      case 'setting':
        return slot.subCategoryName !== null ? slot.subCategoryName : "-----";
      default:
        return "----";
    }
  }

  changeSingleView(slot:any, e:any){
    if (e == 'user') {

      slot.activeUser = true;
      setTimeout(() => {
        slot.activeUser = false;
      }, 2000);
      slot.activeSetting = false;
    } else if (e == 'setting') {
      slot.activeSetting = true;
      setTimeout(() => {
        slot.activeSetting = false;
      }, 2000);
      slot.activeUser = false;
    } else {
      slot.activeSetting = false;
      slot.activeUser = false;
      // this.getDisplayedValue(slot)
    }

  }

  getSoDetails(data:any){
    const dialogRef = this.dialog.open(AxSoDetailsModelComponent, {
      width: '60%', // Adjust the width as needed
      data: {
        title: data.soNumber,
        tableData:data
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        
      }
    });
  }

}
