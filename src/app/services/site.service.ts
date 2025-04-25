import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { SiteDeleteEntity, SiteSelectEntity, Siteentity } from '../interfaces/siteentity';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private base: BaseService) { }

  getSite(siteData: SiteSelectEntity) {
    return this.base.post('Site/SiteSelect', siteData).pipe(map((response: any) => {
      return response;
    }));
  }

  inserUpdateSite(siteData: Siteentity) {
    return this.base.post('Site/SiteInsertUpdate', siteData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteSite(siteData: SiteDeleteEntity) {
    return this.base.post('Site/SiteDelete', siteData).pipe(map((response: any) => {
      return response;
    }));
  }
}
