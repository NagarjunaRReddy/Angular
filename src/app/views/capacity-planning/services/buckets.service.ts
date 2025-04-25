import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { map } from 'rxjs';
import { BucketDeleteEntity, BucketEntity, BucketPlanningInsertSelect, BucketSelectEntity } from '../interfaces/buckets';
@Injectable({
  providedIn: 'root'
})
export class BucketsService {

  constructor(private base: BaseService) { }
  BucketInsertUpdate(bucketData: BucketEntity) {
    return this.base.post('Bucket/InsertUpdateBucket', bucketData).pipe(map((response: any) => {
      return response;
    }));
  }

  BucketSelect(bucketData: BucketPlanningInsertSelect) {
    return this.base.post('Bucket/BucketSelect', bucketData).pipe(map((response: any) => {
      return response;
    }));
  }

  BucketDelete(bucketData: BucketDeleteEntity) {
    return this.base.post('Bucket/BucketDelete', bucketData).pipe(map((response: any) => {
      return response;
    }));
  }

  GetBucketData(bucketData: BucketSelectEntity) {
    return this.base.post('Bucket/GetBucketDatesDetails', bucketData).pipe(map((response: any) => {
      return response;
    }));
  }
}
