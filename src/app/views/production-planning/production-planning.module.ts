import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductionPlanningRoutingModule } from './production-planning-routing.module';
import { ProductionPlanningComponent } from './production-planning.component';
import { SopPanViewComponent } from './sop-production-planning/sop-pan-view/sop-pan-view.component';
import { SopSoDetailsModelComponent } from './sop-production-planning/sop-so-details-model/sop-so-details-model.component';
import { SopProductionPlanningComponent } from './sop-production-planning/sop-production-planning.component';
import { AxProductionPlanningComponent } from './ax-production-planning/ax-production-planning.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SopDrawingComponent } from './sop-production-planning/sop-so-edit-model/sop-drawing/sop-drawing.component';
import { SopSoEditModelComponent } from './sop-production-planning/sop-so-edit-model/sop-so-edit-model.component';
import { SpecBomCoComponent } from './sop-production-planning/sop-so-edit-model/spec-bom-co/spec-bom-co.component';
import { AppRoutingModule } from '../../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GeneralComponent } from './sop-production-planning/sop-so-edit-model/general/general.component';
import { AddEditBomItemsComponent } from './sop-production-planning/sop-so-edit-model/spec-bom-co/add-edit-bom-items/add-edit-bom-items.component';
import {
  MatAccordion,
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { SpecReviewComponent } from '../spec-review/spec-review.component';
import { CommonSopEditTableComponent } from './sop-production-planning/sop-so-edit-model/common-sop-edit-table/common-sop-edit-table.component';
import { DecalsComponent } from './sop-production-planning/sop-so-edit-model/decals/decals.component';
import { SopAttachmentsComponent } from './sop-production-planning/sop-so-edit-model/sop-attachments/sop-attachments.component';
import { ActionsComponent } from './sop-production-planning/sop-so-edit-model/actions/actions.component';
import { DynamicTabsComponent } from './sop-production-planning/sop-so-edit-model/dynamic-tabs/dynamic-tabs.component';
import { AddEditDecalsComponent } from './sop-production-planning/sop-so-edit-model/decals/add-edit-decals/add-edit-decals.component';
import { AxSoDetailsModelComponent } from './ax-production-planning/ax-so-details-model/ax-so-details-model.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ProductionPlanningComponent,
    SopPanViewComponent,
    SopSoDetailsModelComponent,
    SopProductionPlanningComponent,
    AxProductionPlanningComponent,
    SopDrawingComponent,
    SopSoEditModelComponent,
    SpecBomCoComponent,
    GeneralComponent,
    AddEditBomItemsComponent,
    SpecReviewComponent,
    CommonSopEditTableComponent,
    DecalsComponent,
    SopAttachmentsComponent,
    ActionsComponent,
    DynamicTabsComponent,
    AddEditDecalsComponent,
    AxSoDetailsModelComponent,
  ],
  imports: [
    CommonModule,
    ProductionPlanningRoutingModule,
    MatDialogModule,
    MatTooltipModule,
    DragDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAccordion,
    MatExpansionModule,
    MatExpansionPanel,
  ],
  providers:[DatePipe]
})
export class ProductionPlanningModule {}
