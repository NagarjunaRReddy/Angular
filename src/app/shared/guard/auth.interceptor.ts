import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { HelperService } from "../../services/helper.service";
import { ToastrService } from "ngx-toastr";

@Injectable()

export class AuthInterceptor
 implements HttpInterceptor{
    token:any;
    constructor(private router:Router,
        private helper:HelperService,
        private toster:ToastrService
    ){}

    intercept(req: HttpRequest<any>,
         next: HttpHandler
        ): Observable<HttpEvent<any>> {
            this.token = this.helper.getValue('authKey');   
            if(this.token != null){
                const cloneReq = req.clone({
                    headers:req.headers.set(
                        'Authorization',
                        `Bearer  ${this.token}`
                    )
                });
                return next.handle(cloneReq).pipe(
                    tap(
                        succ => {},
                        err => {
                            if(err.status == 401) {
                                //here code for remove the token
                               this.handleUnauthorized();
                            }else if (err.status == 403){
                                this.handleUnauthorized();
                                //here for navigate some error page
                            }
                        }
                    )
                );
            } else {
                return next.handle(req.clone());
            }
    }


    private handleUnauthorized() {
        // Handle token removal and redirect to login or another page
        this.toster.warning('You are not authorized to access the section')
        this.helper.removeValue('authKey'); // Remove token from storage (e.g., localStorage/sessionStorage)
        this.router.navigate(['/auth/login']); // Navigate to login or appropriate page
      }
}