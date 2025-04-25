import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DecalsService {

  constructor(private base: BaseService) { }

  insertUpdateDecals(decalData: any) {
    return this.base.post('ProductionPlanning/ProductionPlanDecalsInsertUpdate', decalData).pipe(map((response: any) => {
      return response;
    }));
  }
}
