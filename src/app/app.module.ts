import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ThemeService } from './services/theme.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BigPartsComponent } from './views/big-parts/big-parts.component';
import { BigPartsModule } from './views/big-parts/big-parts.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SpecReviewModule } from './views/spec-review/spec-review.module';
import { DatePipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './shared/guard/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from './services/loader.service';
import {
  ErrorInterceptor,
  LoaderInterceptor,
} from './shared/interceptor/loader.interceptor';

export function initializeApp(themeService: ThemeService) {
  return () => themeService.loadTheme();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BigPartsModule,
    HttpClientModule,
    SharedModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    MatDialogModule,
    MatSelectModule,
    SpecReviewModule,
  ],
  providers: [
    DatePipe,
    provideAnimationsAsync(),
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ThemeService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
