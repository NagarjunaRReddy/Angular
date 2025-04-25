import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root',
})
export class SalesStatusService {
  private salesStatusState$ = new BehaviorSubject<any[]>([]);
  private fetched = false;

  constructor(private base: BaseService) {}

  getSalesStatus(salesData: any): Observable<any[]> {
    if (this.fetched) {
      return this.salesStatusState$.asObservable();
    } else {
      return this.base
        .post('SalesStatusMaster/SalesStatusSelect', salesData)
        .pipe(
          map((response: any) => {
            this.salesStatusState$.next(response);
            this.fetched = true;
            return response;
          })
        );
    }
  }

  insertUpdateSalesStatus(salesData: any) {
    return this.base
      .post('SalesStatusMaster/SalesStatusInsertandUpdate', salesData)
      .pipe(
        map((response: any) => {
          if (response[0].ErrorMessage) {
            return response;
          } else {
            this.resetState();
            return response;
          }
        })
      );
  }

  deleteSalesStatus(salesData: any) {
    return this.base
      .post('SalesStatusMaster/SalesStatusDelete', salesData)
      .pipe(
        map((response: any) => {
          this.resetState();
          return response;
        })
      );
  }

  resetState() {
    this.salesStatusState$.next([]);
    this.fetched = false;
  }
}
