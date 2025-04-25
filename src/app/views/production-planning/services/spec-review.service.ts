import { Injectable } from '@angular/core';
import { SpecreviewstatusDeleteEntity, SpecreviewstatusEntity, SpecreviewstatusSelectEntity } from '../interfaces/spec-review-interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class SpecReviewService {

  private specReviewState$ = new BehaviorSubject<SpecreviewstatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getSpec(specData: SpecreviewstatusSelectEntity): Observable<SpecreviewstatusEntity[]> {
    if (this.fetched) {
      return this.specReviewState$.asObservable();
    } else {
      return this.base.post('Specreviewstatus/SpecreviewstatusSelect', specData).pipe(map((response: any) => {
        this.specReviewState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateSpec(specData: SpecreviewstatusEntity) {
    return this.base.post('Specreviewstatus/SpecreviewstatusInsertandUpdate', specData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  insertUpdateSpecBomCo(specBomCoData: any) {
    return this.base.post('ProductionPlanning/ProductionPlanBomSpecAndCoInsertUpdate', specBomCoData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  deleteSpec(specData: SpecreviewstatusDeleteEntity) {
    return this.base.post('Specreviewstatus/SpecreviewstatusDelete', specData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.specReviewState$.next([]);
    this.fetched = false;
  }

}
