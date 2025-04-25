import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StepChangedService {

  constructor() { }

  private activeStepSubject = new BehaviorSubject<any>({});

  setPreviousStep(data: any) {
    this.activeStepSubject.next(data);
  }

  getPreviousStep() {
    return this.activeStepSubject.asObservable();
  }
}
