import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { InventoryStatusDeleteEntity, InventoryStatusEntity, InventoryStatusSelectEntity } from '../interfaces/inventory-status-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryStatusService {

  constructor(private base: BaseService) { }

  getInventory(inventoryData: InventoryStatusSelectEntity) {
    return this.base.post('InventoryStatus/InventoryStatusSelect', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateInventory(inventoryData: InventoryStatusEntity) {
    return this.base.post('InventoryStatus/InventoryStatusInsertandUpdate', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteInventory(inventoryData: InventoryStatusDeleteEntity) {
    return this.base.post('InventoryStatus/InventoryStatusDelete', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }
}
