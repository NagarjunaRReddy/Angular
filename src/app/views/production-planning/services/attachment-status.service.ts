import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class AttachmentStatusService {

  private attachmentStatusState$ = new BehaviorSubject<any[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getAttachmentStatus(attachmentData: any): Observable<any[]> {
    if (this.fetched) {
      return this.attachmentStatusState$.asObservable();
    } else {
      return this.base.post('AttachmentStatus/AttachmentStatusSelect', attachmentData).pipe(map((response: any) => {
        this.attachmentStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateAttachmentStatus(AttachmentData: any) {
    return this.base.post('AttachmentStatus/AttachmentStatusInsertandUpdate', AttachmentData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteAttachmentStatus(AttachmentData: any) {
    return this.base.post('AttachmentStatus/AttachmentStatusDelete', AttachmentData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.attachmentStatusState$.next([]);
    this.fetched = false;
  }

}
