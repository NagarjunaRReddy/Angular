import { Injectable } from '@angular/core';
import { BOMStatusDeleteEntity, BOMStatusEntity, BOMStatusSelectEntity } from '../interfaces/bom-interface';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class BomService {

  private bomState$ = new BehaviorSubject<BOMStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetBom(bomData: BOMStatusSelectEntity): Observable<BOMStatusEntity[]> {
    if (this.fetched) {
      return this.bomState$.asObservable();
    } else {
      return this.base.post('BOMStatus/BOMStatusSelect', bomData).pipe(map((response: any) => {
        this.bomState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateBom(bomData: BOMStatusEntity) {
    return this.base.post('BOMStatus/BOMInsertandUpdate', bomData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteBom(bomData: BOMStatusDeleteEntity) {
    return this.base.post('BOMStatus/BOMStatusDelete', bomData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.bomState$.next([]);
    this.fetched = false;
  }

}
