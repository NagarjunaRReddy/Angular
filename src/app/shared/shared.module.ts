import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guard/auth.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
import { ConvertDatePipe } from './pipes/convert-date.pipe';
import { StatusColorPipe } from './pipes/status-color.pipe';
import { MonthPickerDirective } from './directives/month-picker.directive';
import { PersonaliseViewComponent } from './components/personalise-view/personalise-view.component';

@NgModule({
  declarations: [
    CapitalizePipe,
    ImagePreviewComponent,
    ConfirmDialogComponent,
    LoaderComponent,
    ConvertDatePipe,
    StatusColorPipe,
    MonthPickerDirective,
    PersonaliseViewComponent,
  ],
  imports: [CommonModule, MatDialogModule, HttpClientModule],
  exports: [
    CapitalizePipe,
    ImagePreviewComponent,
    HttpClientModule,
    LoaderComponent,
    ConvertDatePipe,
    StatusColorPipe,
    PersonaliseViewComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class SharedModule {}
