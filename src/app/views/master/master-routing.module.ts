import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessUnitComponent } from './components/business-unit/business-unit.component';
import { MasterComponent } from './master.component';
import { SiteMasterComponent } from './components/site-master/site-master.component';
import { SalesresposibleComponent } from './components/salesresposible/salesresposible.component';
import { DealerTableComponent } from './components/dealer-table/dealer-table.component';
import { Title } from '@angular/platform-browser';
import { TruckstatusComponent } from './components/truckstatus/truckstatus.component';
import { PrdStageComponent } from './components/prd-stage/prd-stage.component';
import { SpecReviewStatusComponent } from './components/spec-review-status/spec-review-status.component';
import { BomStatusComponent } from './components/bom-status/bom-status.component';
import { CoStatusComponent } from './components/co-status/co-status.component';
import { SerialNumberComponent } from './components/serial-number/serial-number.component';
import { ProductionstatusComponent } from './components/productionstatus/productionstatus.component';
import { AbcinventoryComponent } from './components/abcinventory/abcinventory.component';
import { AttachmentstatusComponent } from './components/attachmentstatus/attachmentstatus.component';
import { ActionstatusComponent } from './components/actionstatus/actionstatus.component';
import { ProductionpoolComponent } from './components/productionpool/productionpool.component';
import { SalesstatusmasterComponent } from './components/salesstatusmaster/salesstatusmaster.component';
import { ActionresponsibleComponent } from './components/actionresponsible/actionresponsible.component';
import { ItemMasterComponent } from './components/item-master/item-master.component';
import { DrawingstatusComponent } from './components/drawingstatus/drawingstatus.component';
import { CoModeComponent } from './components/co-mode/co-mode.component';
import { ProductionPlanningCardViewComponent } from './components/production-planning-card-view/production-planning-card-view.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    data: { title: 'Masters' },
    children: [
      {
        path: '',
        redirectTo: '  ',
        pathMatch: 'full',
        data: { title: 'Business Unit' },
      },
      {
        path: 'business-unit',
        component: BusinessUnitComponent,
        data: { title: 'Business Unit' },
      },
      {
        path: 'site-master',
        component: SiteMasterComponent,
        data: { title: 'Site' },
      },
      {
        path: 'dealer-table',
        component: DealerTableComponent,
        data: { title: 'Dealer Table' },
      },
      {
        path: 'truck-status',
        component: TruckstatusComponent,
        data: { title: 'Truck Status' },
      },
      {
        path: 'prd-stage',
        component: PrdStageComponent,
        data: { title: 'PRD Stage' },
      },
      {
        path: 'spec-review-status',
        component: SpecReviewStatusComponent,
        data: { title: 'Spec Review Status' },
      },
      {
        path: 'bom-status',
        component: BomStatusComponent,
        data: { title: 'Bom Status' },
      },
      {
        path: 'co-status',
        component: CoStatusComponent,
        data: { title: 'Co Status' },
      },
      {
        path: 'serial-number',
        component: SerialNumberComponent,
        data: { title: 'Site Master' },
      },
      {
        path: 'production-status',
        component: ProductionstatusComponent,
        data: { title: 'Production Status' },
      },
      {
        path: 'abc-inventory',
        component: AbcinventoryComponent,
        data: { title: 'ABC Inventory' },
      },
      {
        path: 'attachment-status',
        component: AttachmentstatusComponent,
        data: { title: 'Attachment Status' },
      },
      {
        path: 'action-status',
        component: ActionstatusComponent,
        data: { title: 'Action Status' },
      },
      {
        path: 'co-mode',
        component: CoModeComponent,
        data: { title: 'Co Mode' },
      },
      {
        path: 'drawing-status',
        component: DrawingstatusComponent,
        data: { title: 'Drawing Status' },
      },
      {
        path: 'action-responsible',
        component: ActionresponsibleComponent,
        data: { title: 'Action Responsible' },
      },
      {
        path: 'production-pool',
        component: ProductionpoolComponent,
        data: { title: 'Production Pool' },
      },
      {
        path: 'sales-status-master',
        component: SalesstatusmasterComponent,
        data: { title: 'Sales Status' },
      },
      {
        path: 'sales-resposible',
        component: SalesresposibleComponent,
        data: { title: 'Sales Resposible' },
      },
      {
        path: 'item-master',
        component: ItemMasterComponent,
        data: { title: 'Item Master' },
      },
      {
        path: 'card-view',
        component: ProductionPlanningCardViewComponent,
        data: { title: 'Production Planning Card View' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
