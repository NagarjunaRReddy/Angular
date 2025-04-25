import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';
import { Tablesettingentity } from '../interfaces/tablesettingentity';

@Injectable({
  providedIn: 'root'
})
export class TablesettingService {

  constructor(private base: BaseService) { }

  getTableSettingConfiguration(tableSettingEntity: any) {
    return this.base.post('TableSettings/SelectTableSettingConfigurations', tableSettingEntity).pipe(map((response: any) => {
      return response;
    }));
  }

  InsertOrUpdateTableSettingConfiguration(tableSettingEntity: Tablesettingentity) {
    return this.base.post('TableSettings/InsertOrUpdateTableSettingConfiguration', tableSettingEntity).pipe(map((response: any) => {
      return response;
    }));
  }
}
