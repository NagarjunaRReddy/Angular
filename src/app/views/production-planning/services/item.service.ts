import { ItemMasterDeleteEntity } from './../interfaces/item-interface';
import { Injectable } from '@angular/core';
import { ItemMasterEntity, ItemMasterSelectEntity } from '../interfaces/item-interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private itemState$ = new BehaviorSubject<ItemMasterEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getItem(itemData: ItemMasterSelectEntity): Observable<ItemMasterEntity[]> {
    if (this.fetched) {
      return this.itemState$.asObservable();
    } else {
      return this.base.post('ItemMaster/ItemMasterSelect', itemData).pipe(map((response: any) => {
        this.itemState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateItem(itemData: ItemMasterEntity) {
    return this.base.post('ItemMaster/ItemMasterInsertandUpdate', itemData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteItem(itemData: ItemMasterDeleteEntity) {
    return this.base.post('ItemMaster/ItemMasterDelete', itemData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.itemState$.next([]);
    this.fetched = false;
  }

}
