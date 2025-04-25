import { Component } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  leftmenuData: any;
  userSideData: any[] = [];
  activeData: string = 'User';

  constructor(
    private helper: HelperService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.leftmenuData = JSON.parse(this.helper.getValue('leftMenu'));
    console.log(this.leftmenuData)
    this.userSideData = this.leftmenuData.filter(x => x.Menu_Name == 'User Management')[0].children;
    console.log(this.userSideData);
    const firstReadableMenuItem = this.userSideData.find(item => item.ReadAccess);
    const firstReadablePath = firstReadableMenuItem ? firstReadableMenuItem.MenuPath : null;
    console.log(firstReadablePath);
    this.router.navigateByUrl('/main/users/'+firstReadablePath)
  }

  setActiveStatus(data: any) {
    this.activeData = data.name;
    if (data.name == 'unit') {
      this.router.navigate(['user'], { relativeTo: this.route });
    }
  }
}
