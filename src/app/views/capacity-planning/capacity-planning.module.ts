import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CapacityPlanningRoutingModule } from './capacity-planning-routing.module';
import { CapacityPlanningComponent } from './capacity-planning.component';
import { CapacityAreaComponent } from './components/capacity-area/capacity-area.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BucketsComponent } from './components/buckets/buckets.component';
import { SlotsComponent } from './components/slots/slots.component';
import { AddEditCapacityAreaComponent } from './models/add-edit-capacity-area/add-edit-capacity-area.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddEditBucketsComponent } from './models/add-edit-buckets/add-edit-buckets.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AddEditSlotsComponent } from './models/add-edit-slots/add-edit-slots.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatNativeDateModule,
} from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrModule } from 'ngx-toastr';
import { MatTooltip } from '@angular/material/tooltip';
import { MonthPickerDirective } from './directives/month-picker.directive';
import { GenericDateDirective } from './directives/generic-date.directive';
// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'YYYY MM DD',
//   },
//   display: {
//     dateInput: 'MM/DD/YY',
//     monthYearLabel: 'MMMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

export const DAY_PICKER_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MONTH_PICKER_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    CapacityPlanningComponent,
    CapacityAreaComponent,
    BucketsComponent,
    SlotsComponent,
    AddEditCapacityAreaComponent,
    AddEditBucketsComponent,
    AddEditSlotsComponent,
    MonthPickerDirective,
    GenericDateDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CapacityPlanningRoutingModule,
    MatExpansionModule,
    MatDialogModule,
    FormsModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule,
    MatTooltip,
  ],
  exports: [MonthPickerDirective, GenericDateDirective],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: DAY_PICKER_FORMATS },
  ],
})
export class CapacityPlanningModule {}
