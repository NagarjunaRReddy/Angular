import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  
  private deliveryDateSubject = new BehaviorSubject<Date>(new Date());
  private soListAXEdit = new BehaviorSubject<any>(0);
  soListAXEdit$ = this.soListAXEdit.asObservable();
  private soListSOPEdit = new BehaviorSubject<any>(0);
  soListSOPEdit$ = this.soListSOPEdit.asObservable();
  deliveryDate$ = this.deliveryDateSubject.asObservable();
  
  constructor() { }
  
  get deliveryDate(): Date {
    return this.deliveryDateSubject.value;
  }

  setDeliveryDate(date: Date): void {
    this.deliveryDateSubject.next(date);
  }

  setSoListAXEdit(flag: any): void {
    this.soListAXEdit.next(flag);
  }

  get axFlag(): void {
    return this.soListAXEdit.value;
  }

  get sopFlag(): void {
    return this.soListSOPEdit.value;
  }

  setSoListSOPEdit(flag: any): void {
    this.soListSOPEdit.next(flag);
  }
}
