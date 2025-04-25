import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from '../../../base/base.service';
import { CategoryDeleteEntity, CategoryEntity, CategorySelectEntity } from '../../../interfaces/category-interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryState$ = new BehaviorSubject<CategoryEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  GetCategory(categoryData: CategorySelectEntity): Observable<CategoryEntity[]> {
    console.log(this.categoryState$);
    
    if (this.fetched) {
      return this.categoryState$.asObservable();
    } else {
      return this.base.post('Category/CategorySelect', categoryData).pipe(map((response: any) => {
        this.categoryState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  InsertCategory(categoryData: CategoryEntity) {
    return this.base.post('Category/categoryInsertandUpdate', categoryData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.ResetState();
        return response;
      }
    }));
  }

  DeleteCategory(categoryData: CategoryDeleteEntity) {
    return this.base.post('Category/CategoryDelete', categoryData).pipe(map((response: any) => {
      this.ResetState();
      return response;
    }));
  }

  ResetState() {
    this.categoryState$.next([]);
    this.fetched = false;
  }
}
