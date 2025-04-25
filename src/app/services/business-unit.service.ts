import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BusinessUnitDeleteEntity, BusinessUnitEntity, BusinessUnitSelectEntity } from '../interfaces/business-unit-entity';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessUnitService {

  private businessUnitState$ = new BehaviorSubject<BusinessUnitEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  BusinessUnitInsertUpdate(BussinessUnitDTO: any) {
    return this.base.post('BusinessUnit/InsertUpdateBusinessUnit', BussinessUnitDTO).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  BusinessUnitSelect(businessData: BusinessUnitSelectEntity): Observable<BusinessUnitEntity[]> {
    if (this.fetched) {
      return this.businessUnitState$.asObservable();
    } else {
      return this.base.post('BusinessUnit/SelectAllBussinessUnit', businessData).pipe(map((response: any) => {
        this.businessUnitState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  BusinessUnitDelete(businessData: BusinessUnitDeleteEntity) {
    return this.base.post('BusinessUnit/DeleteBussinessUnit', businessData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.businessUnitState$.next([]);
    this.fetched = false;
  }
}