import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { AbcInventory, AbcInventoryDelete, selectAbcInventory } from '../interfaces/abcInventory-entiry';
import { MatOptgroup } from '@angular/material/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbcinventoryService {

  constructor(private base:BaseService) { }

  getAbcInventory(AbcData:selectAbcInventory){
    return this.base.post('ABCInventory/ABCInventorySelect',AbcData).pipe(map((res:any) => {
      return res;
    }));
  }

  insertUpdateAbcInventory(AbcInventory:AbcInventory){
    return this.base.post('ABCInventory/ABCInventoryInsertandUpdate',AbcInventory).pipe(map((res:any) => {
      return res;
    }));
  }

  deleteAbcInventory(AbcInventory:AbcInventoryDelete){
    return this.base.post('ABCInventory/ABCInventoryDelete',AbcInventory).pipe(map((res:any) => {
      return res;
    }));
  }
}
