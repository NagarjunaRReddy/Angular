import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventorystatusComponent } from './components/inventorystatus/inventorystatus.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
//import { MY_FORMATS } from '../capacity-planning/capacity-planning.module';
import { InventoryonhandComponent } from './components/inventoryonhand/inventoryonhand.component';
import { InventorypurchaseorderComponent } from './components/inventorypurchaseorder/inventorypurchaseorder.component';
import { MatInputModule } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY MM DD',
  },
  display: {
    dateInput: 'MM-DD-YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    InventoryComponent,
    InventorystatusComponent,
    InventoryonhandComponent,
    InventorypurchaseorderComponent,
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTooltip,
    MatSortModule,
  ],

  providers: [
    DatePipe,
    //{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InventoryModule {}
