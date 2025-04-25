import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { RoleDeleteEntity, RoleEntity, RolePermissionEntity, RolePermissionLeftMenuEntity, RolePermissionSelectEntity, RoleSelectEntity } from '../interfaces/role-entity';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private base: BaseService) { }

  getRole(roleData: RoleSelectEntity) {
    return this.base.post('Role/RoleSelect', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateRole(roleData: RoleEntity) {
    return this.base.post('Role/RoleInsertandUpdate', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteRole(roleData: RoleDeleteEntity) {
    return this.base.post('Role/RoleDelete', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  getRolePermission(roleData: RolePermissionSelectEntity) {
    return this.base.post('RolePermission/RolePermissionSelect', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateRolePermission(roleData: RolePermissionEntity) {
    return this.base.post('RolePermission/RolePermissionInsertandUpdate', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  RolePermissionLeftMenu(roleData: RolePermissionLeftMenuEntity){
    return this.base.post('RolePermission/RolePermissionLeftMenu', roleData).pipe(map((response: any) => {
      return response;
    }));
  }
}
