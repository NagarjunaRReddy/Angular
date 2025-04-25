import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { BaseService } from '../../../base/base.service';
import { ActionResponsibleDeleteEntity, ActionResponsibleEntity, ActionResponsibleSelectEntity } from '../../../interfaces/action-responsible-interface';

@Injectable({
  providedIn: 'root'
})
export class ActionResponsibleService {

  private actionResponsibleState$ = new BehaviorSubject<ActionResponsibleEntity[]>([]);
  private fetched = false;

  constructor(private base: BaseService) { }

  getAction(actionData: ActionResponsibleSelectEntity): Observable<ActionResponsibleEntity[]> {
  
      return this.base.post('ActionResponsible/ActionResponsibleSelect', actionData).pipe(map((response: any) => {
        this.actionResponsibleState$.next(response);
        this.fetched = true;
        return response;
      }));
  }

  insertUpdateAction(actionData: ActionResponsibleEntity) {
    return this.base.post('ActionResponsible/ActionResponsibleInsertUpdate', actionData).pipe(map((response: any) => {
      if (response[0].ErrorMessage) {
        return response;
      } else {
        this.resetState();
        return response;
      }
    }));
  }

  deleteAction(actionData: ActionResponsibleDeleteEntity) {
    return this.base.post('ActionResponsible/ActionResponsibleDelete', actionData).pipe(map((response: any) => {
      this.resetState();
      return response;
    }));
  }

  resetState() {
    this.actionResponsibleState$.next([]);
    this.fetched = false;
  }

}
