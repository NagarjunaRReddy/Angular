import { InventoryItemStatusDeleteEntity, InventoryItemStatusEntity, InventoryItemStatusSelectEntity } from './../interfaces/inventory-item-status-interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemStatusService {

  private inventoryItemStatusState$ = new BehaviorSubject<InventoryItemStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  InventoryItemStatusInsertUpdate(inventoryData: InventoryItemStatusEntity) {
    return this.base.post('InventoryItemStatus/InventoryItemStatusInsertUpdate', inventoryData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  InventoryItemStatusSelect(inventoryData: InventoryItemStatusSelectEntity): Observable<InventoryItemStatusEntity[]> {
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

  InventoryItemStatusDelete(inventoryData: InventoryItemStatusDeleteEntity) {
    return this.base.post('InventoryItemStatus/InventoryItemStatusDelete', inventoryData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.inventoryItemStatusState$.next([]);
    this.fetched = false;
  }

}
