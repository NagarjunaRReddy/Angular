import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { DealersDeleteEntity, DealersEntity, DealersSelectEntity } from '../../../interfaces/dealer-interface';

@Injectable({
  providedIn: 'root'
})
export class DealerService {

  private dealerState$ = new BehaviorSubject<DealersEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetDealer(dealerData: DealersSelectEntity): Observable<DealersEntity[]> {
    if (this.fetched) {
      return this.dealerState$.asObservable();
    } else {
      return this.base.post('Dealer/DealerSelect', dealerData).pipe(map((response: any) => {
        this.dealerState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateDealer(dealerData: DealersEntity) {
    return this.base.post('Dealer/DealerInsertandUpdate', dealerData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.ResetState();
        return response;
      }
    }));
  }

  deleteDealer(dealerData: DealersDeleteEntity) {
    return this.base.post('Dealer/DealerDelete', dealerData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  ResetState() {
    this.dealerState$.next([]);
    this.fetched = false;
  }

}
