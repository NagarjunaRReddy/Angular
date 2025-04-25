import { Injectable } from '@angular/core';
import { ProductionPool, ProductionPoolDeleteEntity, ProductionPoolSelectEntity } from '../interfaces/production-pool';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionPoolService {

  private productionPoolState$ = new BehaviorSubject<ProductionPool[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }


  GetProductionPool(productionPoolData: ProductionPoolSelectEntity): Observable<ProductionPool[]>  {
  
    return this.base.post('ProductionPool/ProductionPoolSelect', productionPoolData).pipe(map((response: any) => {
      this.productionPoolState$.next(response);
      this.fetched = true;
      return response;
    }));
  }

  InsertUpdateProductionPool(productionPoolData: ProductionPool) {
    return this.base.post('ProductionPool/ProductionPoolInsertUpdate', productionPoolData).pipe(map((response: any) => {
      return response;
    }));
  }

  DeleteProductionPool(productionPoolData: ProductionPoolDeleteEntity) {
    return this.base.post('ProductionPool/ProductionPoolDelete', productionPoolData).pipe(map((response: any) => {
      return response;
    }));
  }

  resetState() {
    this.productionPoolState$.next([]);
    this.fetched = false;
  }
}
