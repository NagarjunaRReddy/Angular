import { Injectable } from '@angular/core';
import { SalesResponsibleDeleteEntity, SalesResposible, SalesResposibleSelectEntity } from '../interfaces/sales-resposible';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SalesResposibleService {

  private salesResposibleState$ = new BehaviorSubject<SalesResposible[]>([]);
  private fetched = false;
  
  constructor(private base: BaseService) { }
  
  GetSalesResposible(salesResposibleData: SalesResposibleSelectEntity): Observable<SalesResposible[]> {
    if (this.fetched) {
      return this.salesResposibleState$.asObservable();
    } else {
      return this.base.post('SalesResposible/SalesResponsibleSelect', salesResposibleData).pipe(map((response: any) => {
        this.salesResposibleState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }
  
  SalesResponsibleInsertUpdate(salesResposibleData: SalesResposible) {
    return this.base.post('SalesResposible/SalesResponsibleInsertUpdate', salesResposibleData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }
 
  
  DeleteSalesResposible(salesResposibleData: SalesResponsibleDeleteEntity) {
    return this.base.post('SalesResposible/SalesResponsibleDelete', salesResposibleData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }
    resetState() {
      this.salesResposibleState$.next([]);
      this.fetched = false;
    }
}
