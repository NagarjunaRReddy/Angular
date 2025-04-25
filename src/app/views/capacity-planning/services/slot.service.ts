import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { SlotDeleteEntity, SlotEntity, SlotSelectEntity } from '../interfaces/slots';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  constructor(private base: BaseService) { }

  SlotInsertUpdate(slotData: SlotEntity) {
    return this.base.post('Slot/InsertUpdateSlot', slotData).pipe(map((response: any) => {
      return response;
    }));
  }

  SlotSelect(slotData: SlotSelectEntity) {
    return this.base.post('Slot/SlotSelect', slotData).pipe(map((response: any) => {
      return response;
    }));
  }

  SlotDelete(slotData: SlotDeleteEntity) {
    return this.base.post('Slot/SlotDelete', slotData).pipe(map((response: any) => {
      return response;
    }));
  }
}
