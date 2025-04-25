import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DrawingStatusService {

  private drawingStatusState$ = new BehaviorSubject<any[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getDrawingStatus(drawingData: any): Observable<any[]> {
    if (this.fetched) {
      return this.drawingStatusState$.asObservable();
    } else {
      return this.base.post('DrawingStatus/DrawingStatusSelect', drawingData).pipe(map((response: any) => {
        this.drawingStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateDrawingStatus(DrawingData: any) {
    return this.base.post('DrawingStatus/DrawingStatusInsertandUpdate', DrawingData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteDrawingStatus(DrawingData: any) {
    return this.base.post('DrawingStatus/DrawingStatusDelete', DrawingData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.drawingStatusState$.next([]);
    this.fetched = false;
  }

}
