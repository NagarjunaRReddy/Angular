import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionLogRoutingModule } from './action-log-routing.module';
import { ActionLogComponent } from './components/action-log/action-log.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AddEditGenericActionComponent } from './models/add-edit-generic-action/add-edit-generic-action.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ActionLogComponent, AddEditGenericActionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ActionLogRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTabsModule,
    MatDialogModule,
  ],
})
export class ActionLogModule {}
