import { Injectable } from '@angular/core';
import { COStatusDeleteEntity, COStatusEntity, COStatusSelectEntity } from '../interfaces/co-status-interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CoStatusService {

  private coStatusState$ = new BehaviorSubject<COStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetCOStatus(coData: COStatusSelectEntity): Observable<COStatusEntity[]> {
    if (this.fetched) {
      return this.coStatusState$.asObservable();
    } else {
      return this.base.post('COStatus/COStatusSelect', coData).pipe(map((response: any) => {
        this.coStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateCOStatus(coData: COStatusEntity) {
    return this.base.post('COStatus/COStatusInsertandUpdate', coData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteCOStatus(coData: COStatusDeleteEntity) {
    return this.base.post('COStatus/COStatusDelete', coData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.coStatusState$.next([]);
    this.fetched = false;
  }

}
