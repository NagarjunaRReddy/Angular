import { Injectable } from '@angular/core';
import { CapacityArea, CapacityAreaDeleteEntity, CapacityAreaSelectEntity } from '../interfaces/capacity-planning-area';
import { BaseService } from '../../../base/base.service';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CapacityAreaService {

  constructor(private base: BaseService) { }


  capacityAreaInsertUpdate(CapacityData: CapacityArea) {
    return this.base.post('CapacityArea/CapacityAreaInsertUpdate', CapacityData).pipe(map((response: any) => {
      return response;
    }));
  }

  capacityAreaSelect(CapacityData: CapacityAreaSelectEntity) {
    return this.base.post('CapacityArea/CapacityAreaSelect', CapacityData).pipe(map((response: any) => {
      return response;
    }));
  }

  getAllCapacityArea(tenantId: any) {
    return this.base.post(`CapacityArea/GetcapacityArea?TenantId=${tenantId}`, '').pipe(map((response: any) => {
      return response;
    }));
  }

  capacityAreaDelete(CapacityData: CapacityAreaDeleteEntity) {
    return this.base.post('CapacityArea/CapacityAreaDelete', CapacityData).pipe(map((response: any) => {
      return response;
    }));
  }
}
