import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelperService } from '../../services/helper.service';
import { CapacityAreaService } from '../capacity-planning/services/capacity-area.service';
import { CapacityAreaSelectEntity } from '../capacity-planning/interfaces/capacity-planning-area';


@Component({
  selector: 'app-production-planning',
  templateUrl: './production-planning.component.html',
  styleUrls: ['./production-planning.component.scss'],
})
export class ProductionPlanningComponent implements OnInit, OnDestroy {
  // Array to store capacity area data
  capacityArea: any[] = [];

  // Variable to store the active capacity
  activeCapacity: any = '';

  // Variable to store the selected capacity ID
  selectedCapacityId: any;

  // Variable to store login information
  loginInfo: any;

  // Variable to store left menu data
  leftmenuData: any;

  // Array to store production side data
  productionSideData: any = [];

  // Array to store subscribed services
  subscribedService: Subscription[] = [];
  
  constructor(
    private helper: HelperService,
    private capacityAreaService: CapacityAreaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    
    // Initialization logic when the component is created
    // console.log("WORKING");

    // Parse left menu data from the helper service
    this.leftmenuData = JSON.parse(this.helper.getValue('leftMenu'));
    console.log( this.leftmenuData," this.leftmenuData");

    // Filter production side data from left menu data
    this.productionSideData = this.leftmenuData.filter(
      (x) => x.Menu_Name == 'Production Planning'
    )[0].children;
    console.log(this.productionSideData);
    const firstReadableMenuItem = this.productionSideData.find(item => item.ReadAccess);
    const firstReadablePath = firstReadableMenuItem ? firstReadableMenuItem.MenuPath : null;
    console.log(firstReadablePath);
    this.router.navigateByUrl('/main/production-planning/'+firstReadablePath + "/" + this.selectedCapacityId);
    

    // Parse login information from the helper service
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));

    // Retrieve capacity area data
    this.getCapacityArea();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscribed services when the component is destroyed
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }
  navigateTo(path: string) {
    this.router.navigate([`main/production-planning/${path}`, this.selectedCapacityId]);
    console.log(`Navigating to: main/production-planning/${path}/${this.selectedCapacityId}`);
    console.log("Selected Capacity ID:", this.selectedCapacityId);
  }
  // Function to retrieve capacity area data
  getCapacityArea() {
    let data: CapacityAreaSelectEntity = {
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
      CapacityId: 0,
    };
    const capacitySelectService = this.capacityAreaService
      .capacityAreaSelect(data)
      .subscribe((res: any) => {
        console.log(res, "capacityArea");
        // Combine data from two tables into a single array
        let finalObject = res.Table1;

        // Update the capacityArea array
        this.capacityArea = finalObject;

        // Set the active capacity and selected capacity ID
        this.activeCapacity = this.capacityArea[0].CapacityName;
        this.helper.setValue('capacityName', this.activeCapacity)
        this.selectedCapacityId = this.capacityArea[0].Id;
        const accessMenu = this.productionSideData.filter((e:any) => e.ReadAccess);
        let menuLink = accessMenu[0].MenuPath;
        console.log(menuLink);
        
        console.log(this.selectedCapacityId, "this.selectedCapacityId")
        this.router.navigate([
          `main/production-planning/${menuLink}/` + this.selectedCapacityId,
        ]);
        // const accessMenu = this.productionSideData.filter((e:any) => e.ReadAccess);
        // let menuLink = accessMenu[0].MenuPath;

        // if(menuLink){

        // }
        // Navigate to the default route if the URL does not match the selected capacity ID
      });

    // Add the service subscription to the array
    this.subscribedService.push(capacitySelectService);
  }

  // Function to set the active capacity and navigate to the updated URL
  setActiveCapacity(capacityName: any, id: any) {
    // Update the selected capacity ID and active capacity
    this.selectedCapacityId = id;
    this.activeCapacity = capacityName;
    this.helper.setValue('capacityName', capacityName)

    // Get the current URL segments
    const currentSegments = this.router.url.split('/');

    // Update the last segment with the new capacity ID
    currentSegments[currentSegments.length - 1] = this.selectedCapacityId;

    // Join the segments to form the updated URL
    const updatedUrl = currentSegments.join('/');

    // Navigate to the updated URL
    this.router.navigateByUrl(updatedUrl);
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
