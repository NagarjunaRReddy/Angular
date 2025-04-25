import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { MasterDetailsEntity } from '../interfaces/master-details-entity';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterdetailsService {

  constructor(private base: BaseService) { }

  getMasterDetailsByName(masterData: MasterDetailsEntity) {
   
      return this.base.post('MasterDetails/SelectMasterDetailsByName', masterData).pipe(map((response: any) => {
        
        return response;
      }));
    }
  }

