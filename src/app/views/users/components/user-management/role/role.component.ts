import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AddEditRoleComponent } from './add-edit-role/add-edit-role.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HelperService } from '../../../../../services/helper.service';
import { RoleService } from '../../../../../services/role.service';
import { RoleDeleteEntity, RolePermissionSelectEntity, RoleSelectEntity } from '../../../../../interfaces/role-entity';
import { ConfirmDialogComponent } from '../../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  subscribedService: Subscription[] = [];
  columns: any;
  loginuser: any;
  loginInfo: any;
  displayedColumns: any;
  public dataSource = new MatTableDataSource<any>();
  menuData: any;
  menuAccess: any;
  subMenuAccess: any;

  constructor(
    private dialog: MatDialog,
    private helper: HelperService,
    private toastr: ToastrService,
    private roleService: RoleService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.menuData = JSON.parse(this.helper.getValue('leftMenu'));
    this.setMenuAccess();
    this.getRoleData();
  }

  setMenuAccess(){
    let routerLink = this.router.url;//main/users/role
    this.menuAccess = this.menuData.filter((e:any) => routerLink.includes(e.MenuPath));
    this.subMenuAccess = this.menuAccess[0]?.children.filter((e:any) => e.Menu_Name == "Role")
    console.log(this.menuAccess);
    
    console.log(routerLink);
    
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    })
  }

  ngAfterViewInit() {
    // Set sorting and pagination for the MatTable
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

    // getRolePermission() {
    //   let data: RolePermissionSelectEntity = {
    //     roleId: 0,
    //   }
  
    //   const roleGetService = this.roleService.getRolePermission(data)
    //     .subscribe((res: any) => {
    //       if(res[0].Permissions){
    //         this.menuData = res[0].Permissions;
    //       }
    //       else{
    //         this.menuData = [{}];
    //       }
    //     });
    //   this.subscribedService.push(roleGetService);
    // }

  getRoleData() {
    this.displayedColumns = ['Sl.No', 'RoleName', 'RoleDescription', 'RolePermissionJson', 'actions'];
    this.columns = [
      { field: 'Sl.No', header: 'Sl.No' },
      { field: 'RoleName', header: 'Role Name' },
      { field: 'RoleDescription', header: 'Role Description' },
      { field: 'RolePermissionJson', header: 'Role Permission' },
      { field: 'actions', header: 'Action' }
    ];

    let roleData: RoleSelectEntity = {
      RoleId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const roleGetService = this.roleService.getRole(roleData)
      .subscribe((res: any) => {
        if (res != undefined && res != null) {
          this.dataSource.data = res;
        }
        else{
          this.dataSource = new MatTableDataSource<any>();
        }
      },
        error => {
          this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(roleGetService);
  }

  addRole(event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditRoleComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add Role',
        button: 'Save',
        view: false
      },
      disableClose: true
    });
    dialogRef.afterClosed().toPromise()
      .then((result) => {
        if (result == true) {
          this.getRoleData();
        }
      })
      .catch(error => {
        this.toastr.error("Some Error Occured", "ERROR")
      });
  }

  editRole(row: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditRoleComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update Role',
        button: 'Update',
        view: false,
        value: row
      },
      disableClose: true
    });
    dialogRef.afterClosed().toPromise()
      .then((result) => {
        if (result == true) {
          this.getRoleData();
        }
      })
      .catch(error => {
        this.toastr.error("Some Error Occured", "ERROR")
      });
  }

  deleteRole(row: any, event: Event) {
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
        const roleData: RoleDeleteEntity = {
          RoleId: row.RoleId
        }
        const roleDeleteService = this.roleService.deleteRole(roleData)
          .subscribe((res: any) => {
            if (res[0].SuccessMessage) {
              this.toastr.success(res[0].SuccessMessage, 'Success');
            }
            else {
              this.toastr.error(res[0].ErrorMessage, 'Error');
            }
            this.getRoleData();
          },
            error => {
              this.toastr.error("Some Error Occured", "ERROR")
            });
        this.subscribedService.push(roleDeleteService);
      }
    });
  }

  addPermission(row: any) {
   if(this.subMenuAccess[0].AddAccess){
      const dialogRef = this.dialog.open(RolePermissionComponent, {
        width: '70%',
        data: {
          title: 'Permission',
          button: 'Save',
          value: row
        },
        disableClose: true
      });
      dialogRef.afterClosed().toPromise()
        .then((result) => {
          if (result == true) {
            this.getRoleData();
          }
        })
        .catch(error => {
          this.toastr.error("Some Error Occured", "ERROR")
        });
     }else{
       this.toastr.warning("No allowed to modify data.","WARNING")
     }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
