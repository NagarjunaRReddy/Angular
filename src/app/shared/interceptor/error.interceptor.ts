import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService {
  constructor(private toaster: ToastrService) {}

  handleHttpError(error: HttpErrorResponse): void {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error);
    }
  }
}
