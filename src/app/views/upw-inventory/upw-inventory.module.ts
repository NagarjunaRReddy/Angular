import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpwInventoryRoutingModule } from './upw-inventory-routing.module';
import { DemandComponent } from './components/demand/demand.component';
import { OnhandComponent } from './components/onhand/onhand.component';
import { PurchaseorderComponent } from './components/purchaseorder/purchaseorder.component';
import { UpwinventoryComponent } from './components/upwinventory/upwinventory.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    DemandComponent,
    OnhandComponent,
    PurchaseorderComponent,
    UpwinventoryComponent
  ],
  imports: [
    CommonModule,
    UpwInventoryRoutingModule,
    MatTooltipModule
  ]
})
export class UpwInventoryModule { }
