import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { BusinessUnitComponent } from './components/business-unit/business-unit.component';
import { MasterComponent } from './master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SiteMasterComponent } from './components/site-master/site-master.component';
import { AddeditsiteComponent } from './components/site-master/addeditsite/addeditsite.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SalesresposibleComponent } from './components/salesresposible/salesresposible.component';
import { AddeditsalesresposibleComponent } from './components/salesresposible/addeditsalesresposible/addeditsalesresposible.component';
import { AddEditBusinessUnitComponent } from './components/business-unit/add-edit-business-unit/add-edit-business-unit.component';
import { DealerTableComponent } from './components/dealer-table/dealer-table.component';
import { AddEditDealerTableComponent } from './components/dealer-table/add-edit-dealer-table/add-edit-dealer-table.component';
import { TruckstatusComponent } from './components/truckstatus/truckstatus.component';
import { AddEditTruckstatusComponent } from './components/truckstatus/add-edit-truckstatus/add-edit-truckstatus.component';
import { PrdStageComponent } from './components/prd-stage/prd-stage.component';
import { AddEditPrdStageComponent } from './components/prd-stage/add-edit-prd-stage/add-edit-prd-stage.component';
import { SpecReviewStatusComponent } from './components/spec-review-status/spec-review-status.component';
import { AddeditSpecReviewStatusComponent } from './components/spec-review-status/addedit-spec-review-status/addedit-spec-review-status.component';
import { BomStatusComponent } from './components/bom-status/bom-status.component';
import { AddeditBomStatusComponent } from './components/bom-status/addedit-bom-status/addedit-bom-status.component';
import { CoStatusComponent } from './components/co-status/co-status.component';
import { AddeditCostatusComponent } from './components/co-status/addedit-costatus/addedit-costatus.component';
import { SerialNumberComponent } from './components/serial-number/serial-number.component';
import { AddeditSerialnumberComponent } from './components/serial-number/addedit-serialnumber/addedit-serialnumber.component';
import { ProductionstatusComponent } from './components/productionstatus/productionstatus.component';
import { AddeditproductionstatusComponent } from './components/productionstatus/addeditproductionstatus/addeditproductionstatus.component';
import { AbcinventoryComponent } from './components/abcinventory/abcinventory.component';
import { AddeditabcinventoryComponent } from './components/abcinventory/addeditabcinventory/addeditabcinventory.component';
import { AttachmentstatusComponent } from './components/attachmentstatus/attachmentstatus.component';
import { AddeditattachmentstatusComponent } from './components/attachmentstatus/addeditattachmentstatus/addeditattachmentstatus.component';
import { ActionstatusComponent } from './components/actionstatus/actionstatus.component';
import { AddeditactionstatusComponent } from './components/actionstatus/addeditactionstatus/addeditactionstatus.component';
import { ProductionpoolComponent } from './components/productionpool/productionpool.component';
import { AddeditproductionpoolComponent } from './components/productionpool/addeditproductionpool/addeditproductionpool.component';
import { SalesstatusmasterComponent } from './components/salesstatusmaster/salesstatusmaster.component';
import { AddeditsalesstatusmasterComponent } from './components/salesstatusmaster/addeditsalesstatusmaster/addeditsalesstatusmaster.component';
import { ActionresponsibleComponent } from './components/actionresponsible/actionresponsible.component';
import { AddeditactionresponsibleComponent } from './components/actionresponsible/addeditactionresponsible/addeditactionresponsible.component';
import { ItemMasterComponent } from './components/item-master/item-master.component';
import { EditItemMasterComponent } from './components/item-master/edit-item-master/edit-item-master.component';
import { DrawingstatusComponent } from './components/drawingstatus/drawingstatus.component';
import { AddeditdrawingstatusComponent } from './components/drawingstatus/addeditdrawingstatus/addeditdrawingstatus.component';
import { CoModeComponent } from './components/co-mode/co-mode.component';
import { AddEditCoModeComponent } from './components/co-mode/add-edit-co-mode/add-edit-co-mode.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { InvetoryitemComponent } from './components/invetoryitem/invetoryitem.component';
import { EditinventoryitemComponent } from './components/invetoryitem/editinventoryitem/editinventoryitem.component';
import { ProductionPlanningCardViewComponent } from './components/production-planning-card-view/production-planning-card-view.component';
import { AddEditProductionPlanningCardViewComponent } from './components/production-planning-card-view/add-edit-production-planning-card-view/add-edit-production-planning-card-view.component';
import { SharedModule } from '../../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    BusinessUnitComponent,
    MasterComponent,
    SiteMasterComponent,
    AddeditsiteComponent,
    SalesresposibleComponent,
    AddeditsalesresposibleComponent,
    AddEditBusinessUnitComponent,
    DealerTableComponent,
    AddEditDealerTableComponent,
    TruckstatusComponent,
    AddEditTruckstatusComponent,
    PrdStageComponent,
    AddEditPrdStageComponent,
    SpecReviewStatusComponent,
    AddeditSpecReviewStatusComponent,
    BomStatusComponent,
    AddeditBomStatusComponent,
    CoStatusComponent,
    AddeditCostatusComponent,
    SerialNumberComponent,
    AddeditSerialnumberComponent,
    ProductionstatusComponent,
    AddeditproductionstatusComponent,
    AbcinventoryComponent,
    AddeditabcinventoryComponent,
    AttachmentstatusComponent,
    AddeditattachmentstatusComponent,
    ActionstatusComponent,
    AddeditactionstatusComponent,
    ProductionpoolComponent,
    AddeditproductionpoolComponent,
    SalesstatusmasterComponent,
    AddeditsalesstatusmasterComponent,
    ActionresponsibleComponent,
    AddeditactionresponsibleComponent,
    AddeditsalesresposibleComponent,
    ItemMasterComponent,
    EditItemMasterComponent,
    DrawingstatusComponent,
    AddeditdrawingstatusComponent,
    CoModeComponent,
    AddEditCoModeComponent,
    InvetoryitemComponent,
    EditinventoryitemComponent,
    ProductionPlanningCardViewComponent,
    AddEditProductionPlanningCardViewComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTooltipModule,
    MatSortModule,
    SharedModule,
    DragDropModule,
  ],
})
export class MasterModule {}
