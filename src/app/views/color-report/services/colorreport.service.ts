import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { map } from 'rxjs';
import { ColorReportHeaderEntity, ColorReportHeaderSelectEntity } from '../interfaces/colorreport';

@Injectable({
  providedIn: 'root'
})
export class ColorreportService {

  constructor(private base: BaseService) { }

  GetcolorReportParamAsync() {
    return this.base.get('ColorReport/GetcolorReportParamAsync').pipe(map((response: any) => {
      return response;
    }));
  }
  getBomLineDataListWithParamAsync(prodId: string) {
    return this.base.get('ColorReport/BOMData?ProdId='+prodId).pipe(map((response: any) => {
      return response;
    }));
  }

  ColorReportHeaderInsertUpdate(colorData: ColorReportHeaderEntity) {
    return this.base.post('ColorReport/ColorReportHeaderInsertUpdate', colorData).pipe(map((response: any) => {
      return response;
    }));
  }

  ColorReportHeaderSelect(colorData: ColorReportHeaderSelectEntity) {
    return this.base.post('ColorReport/ColorReportHeaderSelect', colorData).pipe(map((response: any) => {
      return response;
    }));
  }
}
