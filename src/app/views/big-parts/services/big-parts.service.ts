import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { map } from 'rxjs';
import { Chasis, Site } from '../interfaces/chasis';

@Injectable({
  providedIn: 'root'
})
export class BigPartsService {

  constructor(private base: BaseService) { }

  GetChasisData() {
    return this.base.get('BigParts/GetChassisFromAx').pipe(map((response: any) => {
      return response;
    }));
  }
  GetPartsData() {
    return this.base.get('PartsStatus/GetPartsStatus').pipe(map((response: any) => {
      return response;
    }));
  }

  GetOtherBigItemsListFromAx() {
    return this.base.get('BigParts/GetOtherBigItemsListFromAx').pipe(map((response: any) => {
      return response;
    }));
  }
  GetChasisStatusData(status : Chasis) {
    return this.base.post('ChassisStatus/ChassisStatusSelect', status).pipe(map((response: any) => {
      return response;
    }));
  }
  GetBigPartsList() {
    return this.base.get('BigParts/GetPartsListFromAx').pipe(map((response: any) => {
      return response;
    }));
  }
  GetSiteList(site : Site) {
    return this.base.post('Site/SiteSelect', site).pipe(map((response: any) => {
      return response;
    }));
  }
}
