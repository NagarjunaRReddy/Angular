import { Injectable } from '@angular/core';
import { SpecReviewBOMCOEntity, SpecReviewBOMCOSelectEntity } from '../interfaces/SpecReview-interface';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { SpecreviewstatusEntity } from '../interfaces/spec-review-interface';

@Injectable({
  providedIn: 'root'
})
export class SpecreviewService {
    private truckStatusState$ = new BehaviorSubject<SpecreviewstatusEntity[]>([]);
  private fetched = false;
  constructor(private base: BaseService) { }


  SpecReviewBOMCOInsertUpdate(specData: SpecReviewBOMCOEntity) {
    return this.base.post('SpecReviewBOMCO/SpecReviewBOMCOInsertUpdate', specData).pipe(map((response: any) => {
      return response;
    }));
  }

  SpecReviewBOMCOSelect(specData: SpecReviewBOMCOSelectEntity) {
    return this.base.post('SpecReviewBOMCO/SpecReviewBOMCOSelect', specData).pipe(map((response: any) => {
      return response;
    }));
  }
}
