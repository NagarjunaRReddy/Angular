import { Injectable } from '@angular/core';
import { BaseService } from '../../base/base.service';
import { Ilogin } from '../../interfaces/ilogin';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private base: BaseService) { }


  loginUser(loginData: Ilogin) {
    return this.base.post('User/Login', loginData).pipe(map((response: any) => {
      return response;
    }));
  }
}

