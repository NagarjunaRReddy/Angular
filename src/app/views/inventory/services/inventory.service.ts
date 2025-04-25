import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { map, Observable } from 'rxjs';
import { InventoryItemStatusFilter } from '../interfaces/inventory-item-status-filter';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private base: BaseService) {}

  GetAxInventoryData(inventoryItemStatusFilter:InventoryItemStatusFilter): Observable<any> {
    return this.base.post('InventoryFromAx/InventtoryFromAx',inventoryItemStatusFilter).pipe(map((response: any) => {
         
          return response;
        }));;
  }

  GetAxOnHandData(): Observable<any> {
    return this.base.get('InventoryFromAx/OnhandFromAx');
  }

  PurchaseOrderFrom(): Observable<any> {
    return this.base.get('InventoryFromAx/PurchaseOrderFromAx');
  }
}
