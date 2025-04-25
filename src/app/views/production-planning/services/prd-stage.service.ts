import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { PRDStageDeleteEntity, PRDStageEntity, PRDStageSelectEntity } from '../../../interfaces/prd-stage-interface';

@Injectable({
  providedIn: 'root'
})
export class PrdStageService {

  private prdStageState$ = new BehaviorSubject<PRDStageEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getPrd(prdData: PRDStageSelectEntity): Observable<PRDStageEntity[]> {
    if (this.fetched) {
      return this.prdStageState$.asObservable();
    } else {
      return this.base.post('PRDStage/PRDStageSelect', prdData).pipe(map((response: any) => {
        this.prdStageState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdatePrd(prdData: PRDStageEntity) {
    return this.base.post('PRDStage/PRDStageInsertandUpdate', prdData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deletePrd(prdData: PRDStageDeleteEntity) {
    return this.base.post('PRDStage/PRDStageDelete', prdData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.prdStageState$.next([]);
    this.fetched = false;
  }

}
