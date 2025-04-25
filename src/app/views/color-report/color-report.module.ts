import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ColorReportRoutingModule } from './color-report-routing.module';
import { ColorReportComponent } from './components/color-report/color-report.component';
import { ColorreportviewComponent } from './components/colorreportview/colorreportview.component';
import { ExportExcelService } from '../../services/export-excel.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '../../shared/shared.module';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY MM DD',
  },
  display: {
    dateInput: 'MM/DD/YY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [ColorReportComponent, ColorreportviewComponent],
  imports: [
    CommonModule,
    ColorReportRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDialogModule,
    MatInputModule,
    MatTooltip,
    MatSortModule,
  ],
  providers: [
    DatePipe,
    ExportExcelService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ColorReportModule {}
