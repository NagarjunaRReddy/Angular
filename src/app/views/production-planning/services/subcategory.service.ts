import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { SubCategoryDeleteEntity, SubCategoryEntity, SubCategorySelectEntity } from '../interfaces/subcategory-interface';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private subCategoryState$ = new BehaviorSubject<SubCategoryEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetSubcategory(subcategoryData: SubCategorySelectEntity): Observable<SubCategoryEntity[]> {
    if (this.fetched) {
      return this.subCategoryState$.asObservable();
    } else {
      return this.base.post('SubCategory/SubCategorySelect', subcategoryData).pipe(map((response: any) => {
        this.subCategoryState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }


  insertUpdateSubcategory(subcategoryData: SubCategoryEntity) {
    return this.base.post('SubCategory/SubcategoryInsertandUpdate', subcategoryData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.ResetState();
        return response;
      }
    }));
  }

  deleteSubcategory(subcategoryData: SubCategoryDeleteEntity) {
    return this.base.post('SubCategory/SubCategoryDelete', subcategoryData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  ResetState() {
    this.subCategoryState$.next([]);
    this.fetched = false;
  }

}
