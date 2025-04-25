import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { InventoryAbcEntity, InventoryAbcSelectEntity } from '../../../interfaces/inventory-abc-interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryAbcService {

  constructor(private base: BaseService) { }

  InventoryAbcSelect(inventoryData: InventoryAbcSelectEntity) {
    return this.base.post('InventoryAbc/InventoryAbcSelect', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  InventoryAbcSoSelect(inventoryData: InventoryAbcEntity) {
    return this.base.post('InventoryAbc/InventoryAbcSOSelect', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }

  InventoryAbcAxInventorySelect(inventoryData: InventoryAbcEntity) {
    return this.base.post('InventoryAbc/InventoryAbcAxInventorySelect', inventoryData).pipe(map((response: any) => {
      return response;
    }));
  }
}
