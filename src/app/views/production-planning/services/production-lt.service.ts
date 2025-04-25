import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { ProductionLtDelete, ProductionLtInsertUpdate, ProductionLtSelect } from '../interfaces/production-lt-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionLtService {

  constructor(private base: BaseService) { }

  getProductionLT(prdData: ProductionLtSelect) {
    return this.base.post('ProductionLT/ProductionLTSelect', prdData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateProductionLT(prdData: ProductionLtInsertUpdate) {
    return this.base.post('ProductionLT/ProductionLTInsertandUpdate', prdData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteProductionLT(prdData: ProductionLtDelete) {
    return this.base.post('ProductionLT/ProductionLTDelete', prdData).pipe(map((response: any) => {
      return response;
    }));
  }
}
