import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { ErrorInterceptorService } from './error.interceptor';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requestsCounter = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestsCounter++;
    this.loaderService.showLoader(); // Show loader when a request is made

    return next.handle(request).pipe(
      finalize(() => {
        this.requestsCounter--;

        if (this.requestsCounter === 0) {
          // Hide loader when all requests are complete
          this.loaderService.hideLoader();
        }
      })
    );
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandlingService: ErrorInterceptorService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle HTTP errors here or pass them to your error handling service
        this.errorHandlingService.handleHttpError(error);
        return throwError(error);
      })
    );
  }
}
