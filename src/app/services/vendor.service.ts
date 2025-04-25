import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private base: BaseService) { }
  
    getVendorName() {
      return this.base.get('VendorName/VendorNameSelect').pipe(map((response: any) => {
        return response;
      }));
    }
  
}
