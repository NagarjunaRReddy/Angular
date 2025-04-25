import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseService } from '../base/base.service';
import { InventoryItemStatusSelectEntity } from '../interfaces/inventoryitemstatus';

@Injectable({
  providedIn: 'root'
})
export class InventoryitemstatusService {

  private inventoryItemStatusState$ = new BehaviorSubject<InventoryItemStatusSelectEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  InventoryItemStatusSelect(inventoryData: InventoryItemStatusSelectEntity): Observable<InventoryItemStatusSelectEntity[]> {
    if (this.fetched) {
      return this.inventoryItemStatusState$.asObservable();
    } else {
      return this.base.post('InventoryItemStatus/InventoryItemStatusSelect', inventoryData).pipe(map((response: any) => {
        this.inventoryItemStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }
  }

