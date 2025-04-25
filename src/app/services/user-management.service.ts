import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';
import { BusinessSelectEntity, RoleSelectEntity, TenantSelectEntity } from '../interfaces/user-management-interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private base: BaseService) { }

  getLanguageData(){
    return this.base.postwitoutdata('LanguageMaster/LanguageDropdown').pipe(map((response: any) => {
      return response;
    }));
  }

  getTenantData(tenantData: TenantSelectEntity){
    return this.base.post('Tenant/TenantSelect', tenantData).pipe(map((response: any) => {
      return response;
    }));
  }

  getRoleData(roleData: RoleSelectEntity){
    return this.base.post('Role/RoleSelect', roleData).pipe(map((response: any) => {
      return response;
    }));
  }

  getBussinessRoleData(UserbusinessRole:BusinessSelectEntity){
    return this.base.post('BusinessUnit/SelectAllBussinessUnit',UserbusinessRole).pipe(map((response:any) => {
      return response;
    }))
  }
}
