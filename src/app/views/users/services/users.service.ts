import { Injectable } from '@angular/core';
import { BaseService } from '../../../base/base.service';
import { ILoginuser } from '../../../interfaces/login-interface';
import { UserDeleteEntity, UserEntity, UserSelectEntity } from '../../../interfaces/user-interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor( private base: BaseService) { }
  loginUser(loginData: ILoginuser) {
    return this.base.post('User/Login', loginData).pipe(map((response: any) => {
      return response;
    }));
  }

  insertUpdateUser(userData: UserEntity) {
    return this.base.post('User/UserInsertandUpdate', userData).pipe(map((response: any) => {
      return response;
    }));
  }

  selectUser(userData: UserSelectEntity) {
    return this.base.post('User/UserSelect', userData).pipe(map((response: any) => {
      return response;
    }));
  }

  deleteUser(userData: UserDeleteEntity) {
    return this.base.post('User/UserDelete', userData).pipe(map((response: any) => {
      return response;
    }));
  }

  forgetPassword(email:string) {
    //const params = new HttpParams().set('email', email);
    return this.base.post(`User/ForgetPassword?email=${email}`,'').pipe(map((response: any) => {
      return response;
      }));
  }

  UserBusinessUnitSelectByid(UserId : number){
    return this.base.get('User/bussinessroleselect' + '/'+ UserId).pipe(map((response:any) => {
      return response;
    }));
  }
}
