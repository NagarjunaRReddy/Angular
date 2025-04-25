import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesorderService {

  constructor(private base: BaseService) { }

  getSalesOrderData() {
    return this.base.get('SalesOrderFromAX/SalesOrderFromAx').pipe(map((response: any) => {
      return response;
    }));
  }
}
