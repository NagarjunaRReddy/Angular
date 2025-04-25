import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { map } from 'rxjs';
import { Bigpartsitem, UpdateItemmasterEntity } from '../../../interfaces/bigpartsitem';

@Injectable({
  providedIn: 'root'
})
export class ItemMasterService {

  constructor(private base: BaseService) { }

  getBigPartsItem(bigpartsitem: Bigpartsitem){
    
      return this.base.post('BigParts/BigPartsListSelect',bigpartsitem).pipe(map((response: any) => {
       
        return response;
      }));
    }

    UpdateBigPartsItem(updateitemmasterentity: UpdateItemmasterEntity)
    {
        return this.base.post('BigParts/BigPartsListUpdate',updateitemmasterentity).pipe(map((response: any) => {
         
          return response;
        }));
    }
  
}
