import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BusinessUnitService } from '../../../services/business-unit.service';
import { BusinessUnitSelectEntity } from '../../../interfaces/business-unit-entity';
import { HelperService } from '../../../services/helper.service';
import { UsersService } from '../../../views/users/services/users.service';
import { LoginService } from '../../../auth/services/login.service';
import { BucketsComponent } from '../../../views/capacity-planning/components/buckets/buckets.component';
import { BucketsService } from '../../../views/capacity-planning/services/buckets.service';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit {
  @ViewChild(BucketsService) bucketPlanning :BucketsComponent;
  title: string = '';
  loginInfo: any;
  busineesUnitData!: any;
  selectedBusinessUnitId: number;
  selectedBusinessUnitName: string;
  selectedCapasity: string;
  imageURL: any = '';
  constructor(
    private router: Router,
    private buniessServices: BusinessUnitService,
    private helper: HelperService,
    private UserService: UsersService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo') || '{}');

    // Subscribe to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });

    // Initial title setup
    this.updateTitle();
    //this.busineesUnit();
    this.getBusinessUnit();
  }

  getBusinessUnit() {
    this.busineesUnitData = JSON.parse(this.helper.GetBusinessRole());
    this.helper.setUserCapasity(this.busineesUnitData[0].Capacity ?? "");
  }

  private updateTitle(): void {
    const activeMenu = this.router.url.split('/');
    if (activeMenu.includes('production-planning')) {
      this.title = activeMenu[activeMenu.length - 2];
    } else {
      this.title = activeMenu[activeMenu.length - 1];
    }
    console.log(this.title, 'title');
  }

  busineesUnit() {
    const businessData: BusinessUnitSelectEntity = {
      BusinessUnitId: this.loginInfo.BusinessUnitId,
      TenantId: this.loginInfo.TenantId,
    };
    this.UserService.UserBusinessUnitSelectByid(
      +this.loginInfo.userId
    ).subscribe((res) => {
      this.busineesUnitData = res;
      if (this.busineesUnitData.length > 0) {
        const defaultData = this.busineesUnitData[0];
        this.selectedBusinessUnitId = defaultData.BusinessUnitId;
        this.selectedBusinessUnitName = defaultData.businessUnit;
        this.selectedCapasity = defaultData.Capacity;

        this.helper.setUserBusinessId(this.selectedBusinessUnitId);
        this.helper.setUserCapasity(this.selectedCapasity);
      }
    });
  }
  onBusinessUnitChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = +selectElement.value; // Get the selected BusinessUnitId
    const selectedIndex = selectElement.selectedIndex; // Get the index of the selected option
    const selectedBusinessUnit = this.busineesUnitData[selectedIndex]; // Get the corresponding business unit object

    this.selectedBusinessUnitId = selectedBusinessUnit.BusinessUnitId; // Store the ID
    this.selectedBusinessUnitName = selectedBusinessUnit.businessUnit; // Store the name
    this.helper.setUserBusinessId(selectedBusinessUnit.BusinessUnitId);
    this.helper.setUserCapasity(selectedBusinessUnit.Capacity);
    this.router
    .navigateByUrl('/main', { skipLocationChange: true })
    .then(() => {
      this.router.navigate([this.router.url]); // Reload the same route
    });
  
  }

  setTitle(title: string) {
    return title
      .replace(/[-]/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
}
