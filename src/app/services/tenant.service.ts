import { Injectable } from '@angular/core';
import { TenantEntity } from '../interfaces/tenant-entity';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TenantService {

  constructor(private base: BaseService) { }
  getTenantData(tenantData: TenantEntity){
    return this.base.post('Tenant/TenantSelect', tenantData).pipe(map((response: any) => {
      return response;
    }));
  }
}
