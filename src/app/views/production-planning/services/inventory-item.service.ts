import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { InventoryItemDeleteEntity, InventoryItemEntity } from '../../../interfaces/inventory-item-interface';
import { InventoryItemStatusSelectEntity } from '../interfaces/inventory-item-status-interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryItemService {

  constructor(private base: BaseService) { }

  getInventoryData(inventoryData: InventoryItemStatusSelectEntity) {
    return this.base.post('InventoryItem/InventoryItemSelect', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateInventoryData(inventoryData: InventoryItemEntity) {
    return this.base.post('InventoryItem/InventoryItemUpdate', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteInventoryData(inventoryData: InventoryItemDeleteEntity) {
    return this.base.post('InventoryItem/InventoryItemDelete', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }
}
