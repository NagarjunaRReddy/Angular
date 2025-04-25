import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { filter, Subscription } from 'rxjs';
import { HelperService } from '../../../../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import {
  UserDeleteEntity,
  UserSelectEntity,
} from '../../../../../interfaces/user-interface';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  columns: any;
  loginuser: any;
  loginInfo: any;
  loadTable: boolean = false;
  displayedColumns: any;
  subscribedService: Subscription[] = [];
  public dataSource = new MatTableDataSource<any>();
  userData: any;
  activeFilterButton: any = 'Active';
  menuData: any;
  menuAccess: any;
  subMenuAccess: any;
  settings = {
    TableSettingsId: 3,
    RoleId: 6,
    IsScrollable: false,
    IsPagination: true,
    IsSorting: true,
    IsFilter: true,
    IsMultiselect: false,
    Pagination: true,
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };

  themeSettings = {
    RoleId: 6,
    ColourMode: 'light',
    ColourThemeSettingId: 1,
    PrimaryBackgroundColour: '#141bdb',
    SecondaryBackgroundColour: '#802836',
    PrimaryTextColour: '#000000',
    OnHoverColour: '#000000',
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };
  constructor(
    private dialog: MatDialog,
    private helper: HelperService,
    private toastr: ToastrService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.menuData = JSON.parse(this.helper.getValue('leftMenu'));
    this.getUserData();
    this.setMenuAccess();
  }

  setMenuAccess() {
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
    console.log(this.menuAccess);
    this.subMenuAccess = this.menuAccess[0].children.filter(
      (e: any) => e.Menu_Name == 'User'
    );

    console.log(routerLink);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    });
  }

  getUserData() {
    this.displayedColumns = [
      'Sl.No',
      'FirstName',
      'LastName',
      'EmailId',
      'ContactNo',
      'ActiveStatus',
      'RoleName',
      'actions',
    ];
    this.columns = [
      { field: 'Sl.No', header: 'Sl.No' },
      { field: 'FirstName', header: 'First Name' },
      { field: 'LastName', header: 'Last Name' },
      { field: 'EmailId', header: 'Email' },
      { field: 'ActiveStatus', header: 'Status' },
      { field: 'ContactNo', header: 'Contact Number' },
      { field: 'RoleName', header: 'Access Role' },
      { field: 'actions', header: 'Action' },
    ];

    let userData: UserSelectEntity = {
      UserId: 0,
      TenantID: 1, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };

    const userGetService = this.userService.selectUser(userData).subscribe(
      (res: any) => {
        if (res != undefined && res != null) {
          this.userData = res;
          this.dataSource.data = this.userData.filter((e: any) => {
            if (this.activeFilterButton == 'Active') {
              return e.ActiveStatus == 1;
            } else if (this.activeFilterButton == 'InActive') {
              return e.ActiveStatus == 0;
            } else {
              return true;
            }
          });
        } else {
          this.dataSource = new MatTableDataSource<any>();
        }
      },
      (error) => {
        this.toastr.error('Some Error Occured', 'ERROR');
      }
    );
    this.subscribedService.push(userGetService);
  }

  addUser(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '57%', // Adjust the width as needed
      data: {
        title: 'Add user',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getUserData();
        }
      })
      .catch((error) => {
        this.toastr.error('Some Error Occured', 'ERROR');
      });
  }

  editUser(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      width: '57%', // Adjust the width as needed
      data: {
        title: 'Update User',
        button: 'Update',
        view: false,
        value: row,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getUserData();
        }
      })
      .catch((error) => {
        this.toastr.error('Some Error Occured', 'ERROR');
      });
  }

  deleteUser(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let userData: UserDeleteEntity = {
          UserId: row.UserId,
        };
        const userDeleteService = this.userService
          .deleteUser(userData)
          .subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toastr.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toastr.error(res[0].ErrorMessage, 'Error');
              }
              this.getUserData();
            },
            (error) => {
              this.toastr.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(userDeleteService);
      }
    });
  }

  ngAfterViewInit() {
    // Set sorting and pagination for the MatTable
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setFilterButton(val: string) {
    this.activeFilterButton = val;
    switch (val) {
      case 'All':
        this.dataSource.data = this.getAllUsers();
        break;
      case 'Active':
        this.dataSource.data = this.filterUsersByActiveStatus(1);
        break;
      case 'InActive':
        this.dataSource.data = this.filterUsersByActiveStatus(0);
        break;
    }
  }

  // Function to filter users based on ActiveStatus
  filterUsersByActiveStatus(activeStatus: number): any[] {
    return this.userData.filter((user) => user.ActiveStatus === activeStatus);
  }

  // Function to get all users
  getAllUsers(): any[] {
    return this.userData;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
