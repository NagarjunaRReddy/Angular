import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { ActionStatusDeleteEntity, ActionStatusEntity, ActionStatusSelectEntity } from '../../../interfaces/action-status-interface';

@Injectable({
  providedIn: 'root'
})
export class ActionStatusService {

  private actionStatusState$ = new BehaviorSubject<ActionStatusEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getAction(actionData: ActionStatusSelectEntity): Observable<ActionStatusEntity[]> {
    if (this.fetched) {
      return this.actionStatusState$.asObservable();
    } else {
      return this.base.post('ActionStatus/ActionStatusSelect', actionData).pipe(map((response: any) => {
        this.actionStatusState$.next(response);
        this.fetched = true;
        return response;
      }));
    }
  }

  insertUpdateAction(actionData: ActionStatusEntity) {
    return this.base.post('ActionStatus/ActionStatusInsertUpdate', actionData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteAction(actionData: ActionStatusDeleteEntity) {
    return this.base.post('ActionStatus/ActionStatusDelete', actionData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.actionStatusState$.next([]);
    this.fetched = false;
  }

}
