import { Injectable } from '@angular/core';
import { TruckStatusDeleteEntity, TruckStatusEntity, TruckStatusSelectEntity } from '../interfaces/truck-status.interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class TruckStatusService {

  private truckStatusState$ = new BehaviorSubject<TruckStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetTruck(truckData: TruckStatusSelectEntity): Observable<TruckStatusEntity[]> {
    if (this.fetched) {
      return this.truckStatusState$.asObservable();
    } else {
      return this.base.post('TruckStatus/TruckStatusSelect', truckData).pipe(map((response: any) => {
        this.truckStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateTruck(truckData: TruckStatusEntity) {
    return this.base.post('TruckStatus/TruckStatusInsertandUpdate', truckData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.ResetState();
        return response;
      }
    }));
  }

  deleteTruck(truckData: TruckStatusDeleteEntity) {
    return this.base.post('TruckStatus/TruckStatusDelete', truckData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  ResetState() {
    this.truckStatusState$.next([]);
    this.fetched = false;
  }

}
