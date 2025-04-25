import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../../../services/helper.service';
import { RoleService } from '../../../../../../services/role.service';
import { RolePermissionEntity, RolePermissionSelectEntity } from '../../../../../../interfaces/role-entity';


@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss']
})
export class RolePermissionComponent implements OnInit, OnDestroy {

  menuData: any[] = []
  loginDetails: any;
  loginInfo: any;
  subscribedService: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<RolePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private helper: HelperService,
    private toastr: ToastrService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loginInfo = JSON.parse(this.helper.getValue('LoginInfo'));
    this.getRolePermission();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribedService.forEach((element) => {
      element.unsubscribe();
    })
  }

  getRolePermission() {
    let data: RolePermissionSelectEntity = {
      roleId: this.data.value.RoleId
    }

    const roleGetService = this.roleService.getRolePermission(data)
      .subscribe(
        (res: any) => {
        if(res[0].Permissions){
          this.menuData = res[0].Permissions;
        }
        else{
          this.menuData = [{}];
        }
      });
    this.subscribedService.push(roleGetService);
  }

  toggleParentCheckboxes(item: any) {
    if (!item.IsChildren) {
      // If the item doesn't have children, toggle its own properties
      if (item.ReadAccess) {
        item.AddAccess = true;
        item.EditAccess = true;
        item.DeleteAccess = true;
      } else {
        item.AddAccess = false;
        item.EditAccess = false;
        item.DeleteAccess = false;
      }
    } else {
      // If the item has children, toggle the properties of its children
      const isChecked = item.ReadAccess;
      item.children.forEach((child) => {
        child.ReadAccess = isChecked;
        child.AddAccess = isChecked;
        child.EditAccess = isChecked;
        child.DeleteAccess = isChecked;
      });
    }
  }

  toggleChildrenCheckboxes(child: any, parent: any) {
    if (child.AddAccess || child.EditAccess || child.DeleteAccess) {
      // If the selectAll checkbox is checked, enable all child checkboxes
      child.ReadAccess = true;
      // parent.selectAll = false;
    } else {
      child.ReadAccess = child.ReadAccess;
      // parent.selectAll = true
    }
  }

  toggleChildParentCheckboxes(child: any, parent: any) {
    console.log(parent);
  
    if (child.ReadAccess) {
      // If child's ReadAccess is true
      child.AddAccess = true;
      child.EditAccess = true;
      child.DeleteAccess = true;
      parent.ReadAccess = true;
    } else {
      // If child's ReadAccess is false
      child.AddAccess = false;
      child.EditAccess = false;
      child.DeleteAccess = false;
  
      // Check if all children have ReadAccess set to false
      if (parent.children.every((c: any) => !c.ReadAccess)) {
        parent.ReadAccess = false;
      }
    }
  }
  

  saveData() {
    const _permission: RolePermissionEntity = {
      RoleId: this.data.value.RoleId,
      RolePermissionJson: JSON.stringify(this.menuData),
      CreatedBy: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }
    const roleInsertService = this.roleService.insertUpdateRolePermission(_permission).subscribe(
      (response) => {
        if (response[0].SuccessMessage) {
          this.toastr.success(response[0].SuccessMessage, 'Success');
          this.dialogRef.close(true);
        }
        else {
          this.toastr.error(response[0].ErrorMessage, 'Error');
        }
      },
      error => {
        this.toastr.error("Some Error Occured", "ERROR");
      });
    this.subscribedService.push(roleInsertService);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
