import { Injectable } from '@angular/core';
import { AxProdStatusEntity, AxprodStatusDeleteEntity, AxprodStatusSelectEntity } from '../interfaces/ax-prod-status-entity';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class AxProdStatusService {

  private axProdStatusState$ = new BehaviorSubject<AxProdStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetAxprodSatus(axProdStatusData: AxprodStatusSelectEntity): Observable<AxProdStatusEntity[]> {
    if (this.fetched) {
      return this.axProdStatusState$.asObservable();
    } else {
      return this.base.post('AxProdStatus/AxProdStatusSelect', axProdStatusData).pipe(map((response: any) => {
        this.axProdStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateAxProdStatus(axprodStausData: AxProdStatusEntity) {
    return this.base.post('AxProdStatus/AxProdStatusInsertUpdate', axprodStausData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  deleteTruck(axprodStausData: AxprodStatusDeleteEntity) {
    return this.base.post('AxProdStatus/AxProdStatusDelete', axprodStausData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  ResetState() {
    this.axProdStatusState$.next([]);
    this.fetched = false;
  }
}
