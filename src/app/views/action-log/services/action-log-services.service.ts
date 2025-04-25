import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActionLogServicesService {
  constructor(public http: HttpClient) {}
}
