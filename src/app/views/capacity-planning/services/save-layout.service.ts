import { Injectable } from '@angular/core';
import { BucketSaveEntity, CapacityAreaSaveEntity, DropEntity, SlotSaveEntity } from '../interfaces/capacity-planning-area';
import { map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SaveLayoutService {

capacityChangedTab:boolean = false;
BucketChangedTab:Boolean = false;
SloatChangedTab:boolean = false;

  constructor(private base : BaseService) { }
  capacityAreaSaveLayout(saveData: CapacityAreaSaveEntity) {
    return this.base.post('SaveLayout/SaveLayout', saveData).pipe(map((response: any) => {
      return response;
    }));
  }

  bucketSaveLayout(saveData: BucketSaveEntity) {
    return this.base.post('SaveLayout/SaveLayout', saveData).pipe(map((response: any) => {
      return response;
    }));
  }

  slotSaveLayout(saveData: SlotSaveEntity) {
    return this.base.post('SaveLayout/SaveLayout', saveData).pipe(map((response: any) => {
      return response;
    }));
  }

  

  dropConfiguration(dropData: DropEntity) {
    return this.base.post('SaveLayout/DropConfiguration', dropData).pipe(map((response: any) => {
      return response;
    }));
  }
}
