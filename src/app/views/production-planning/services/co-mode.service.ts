import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CoModeService {

  private coModeState$ = new BehaviorSubject<any[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetCOMode(coData:any ): Observable<any[]> {
    if (this.fetched) {
      return this.coModeState$.asObservable();
    } else {
      return this.base.post('CoMode/CoModeSelect', coData).pipe(map((response: any) => {
        this.coModeState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateCOMode(coData: any) {
    return this.base.post('CoMode/CoModeInsertandUpdate', coData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteCOMode(coData: any) {
    return this.base.post('CoMode/CoModeDelete', coData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.coModeState$.next([]);
    this.fetched = false;
  }
}
