import { Injectable } from '@angular/core';
import { Ilogin } from '../../interfaces/ilogin';
import { BaseService } from '../../base/base.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

isLoggedIn: any = false;

constructor(
  private router: Router,
  private helper: HelperService,
  private toastr: ToastrService
) {
  this.isLoggedIn = this.helper.getValue('isLoggedIn');
}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  if (this.isLoggedIn) {
    return true;
  } else {
    this.toastr.error('Please log in');
    this.router.navigate(['']);
    return false;
  }
}
}