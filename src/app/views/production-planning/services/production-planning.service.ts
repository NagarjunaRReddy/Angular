import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, retryWhen, take, throwError } from 'rxjs';
import { IProductionAX, IProductionPlanActionInsertUpdate, IProductionPlanDynamicInsertUpdate, IProductionPlanGeneralInsertUpdate, IProductionPlanSelectSoNumberEntity, IProductionSOP, IproductionplanAttachmentFileUplod, IproductionplanAttachmentInsertUpdate } from '../interfaces/production-sop';
import { IInsertUpdateSOP } from '../interfaces/insert-update-sop';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionPlanningService {

  constructor(private base: BaseService) { }

  getProductionSop(productionSop: IProductionSOP): Observable<any> {
    return this.base.post('ProductionPlanning/ProductionPlanningSelect', productionSop).pipe(
      retryWhen(errors => errors.pipe(
        delay(1000), // Delay for 1 second before retrying
        take(3), // Retry for a maximum of 3 times
      )),
      catchError(error => {
        // Handle or log the error
        console.error('Error fetching production SOP:', error);
        return throwError(error);
      })
    );
  }

  getProductionAX(productionAx: IProductionAX): Observable<any> {
    return this.base.post('ProductionPlanning/ProductionPlanningAxSelect', productionAx).pipe(
      retryWhen(errors => errors.pipe(
        delay(1000), // Delay for 1 second before retrying
        take(3), // Retry for a maximum of 3 times
      )),
      catchError(error => {
        // Handle or log the error
        console.error('Error fetching production AX:', error);
        return throwError(error);
      })
    );
  }

  getSalesOrderList(bodyData: any): Observable<any> {
    return this.base.post(`SalesOrderFromAX/SalesOrderListForProductionPlanning`, bodyData).pipe(
      retryWhen(errors => errors.pipe(
        delay(1000), // Delay for 1 second before retrying
        take(3), // Retry for a maximum of 3 times
      )),
      catchError(error => {
        // Handle or log the error
        console.error('Error fetching sales order list:', error);
        return throwError(error);
      })
    );
  }
  insertUpdateSOP(insertUpdateSop:IInsertUpdateSOP ) {
    return this.base.post(`ProductionPlanning/ProductionPlanningInsertandUpdate`,insertUpdateSop).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanningSelectbySONumber(editSOP:IProductionPlanSelectSoNumberEntity ) {
    return this.base.post(`ProductionPlanning/ProductionPlanningSelectbySONumber`,editSOP).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanningGeneralInsertUpdate(generalSOP:IProductionPlanGeneralInsertUpdate ) {
    return this.base.post(`ProductionPlanning/ProductionPlanningGeneralInsertUpdate`,generalSOP).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanningActionInsertUpdate(SOPaction:IProductionPlanActionInsertUpdate ) {    return this.base.post(`ProductionPlanning/ProductionPlanningActionInsertUpdate`,SOPaction).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanningDynamicInsertUpdate(SOPdynamic:IProductionPlanDynamicInsertUpdate ) {
    return this.base.post(`ProductionPlanning/ProductionPlanningDynamicInsertUpdate`,SOPdynamic).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanningBomItemInsertUpdate(SOPBOMItem:any ) {
    return this.base.post(`ProductionPlanning/ProductionPlanningBomItemInsertUpdate`,SOPBOMItem).pipe(map((response: any) => {
      return response;
    }));
  }

  productionPlanUploadFile(fileUploadEntity: IproductionplanAttachmentFileUplod) {
    const formdata = new FormData();
    formdata.append('file', fileUploadEntity.Files!);
    return this.base.postWithFile('FileUpload/UploadFile', formdata).pipe(map((response: any) => {
      return response;
    }));
  }


  InsertSopAttachments(bodyData: any) {
    return this.base.post('ProductionPlanning/ProductionPlanAttachmentInsert', bodyData).pipe(map((response: any) => {
      return response;
    }));
  }

  InsertSopDrawing(bodyData: any) {
    return this.base.post('ProductionPlanning/ProductionPlanAttachmentInsert', bodyData).pipe(map((response: any) => {
      return response;
    }));
  }
  
  SopAttachmentFileDownload(fileName:any){
    return this.base.downloadFile(fileName).pipe(map((response:any)=>{
      return response;
    }))
  }

  SopAttachmentFileDelete(bodyData:any){
    return this.base.post('ProductionPlanning/ProductionPlanAttachmentDelete',bodyData).pipe(map((response:any)=>{
      return response;
    }))
  }

  SopDrawingFileDelete(bodyData:any){
    return this.base.post('ProductionPlanning/ProductionPlanAttachmentDelete',bodyData).pipe(map((response:any)=>{
      return response;
    }))
  }

  SopCOFileDelete(bodyData:any){
    return this.base.post('ProductionPlanning/ProductionPlanCOAttachmentDelete',bodyData).pipe(map((response:any)=>{
      return response;
    }))
  }

  ProductionPlanExcelExport(bodyData:any){
    return this.base.post('ProductionPlanning/ProductionPlanExcelExport',bodyData).pipe(map((response:any)=>{
      return response;
    }))
  }

}
