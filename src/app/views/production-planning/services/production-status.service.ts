import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DeleteProductionStatusEntitties, ProductionStatusEntitties, selectProductionStatusEntitties } from '../../../interfaces/productionstatus';

@Injectable({
  providedIn: 'root'
})
export class ProductionStatusService {

  private productionStatusState$ = new BehaviorSubject<ProductionStatusEntitties[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  ProductionStatusSelect(productionStatusData: selectProductionStatusEntitties): Observable<ProductionStatusEntitties[]> {
    if (this.fetched) {
      return this.productionStatusState$.asObservable();
    } else {
      return this.base.post('ProductionStatus/ProductionStatusSelect', productionStatusData).pipe(map((response: any) => {
        this.productionStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  ProductionStatusInsertUpdate(ProductionStatusData: ProductionStatusEntitties) {
    return this.base.post('ProductionStatus/ProductionStatusInsertandUpdate', ProductionStatusData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  ProductionStatusDelete(ProductionStatusData: DeleteProductionStatusEntitties) {
    return this.base.post('ProductionStatus/ProductionStatusDelete', ProductionStatusData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.productionStatusState$.next([]);
    this.fetched = false;
  }
}

