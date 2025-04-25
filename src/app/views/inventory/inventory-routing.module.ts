import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './components/inventory/inventory.component';
import { InventorystatusComponent } from './components/inventorystatus/inventorystatus.component';
import { InventoryonhandComponent } from './components/inventoryonhand/inventoryonhand.component';
import { InventorypurchaseorderComponent } from './components/inventorypurchaseorder/inventorypurchaseorder.component';

const routes: Routes = [
{

  path : '' , component : InventoryComponent, data: { title: 'Inventory' },
    children: [
      {
        path: '',
        redirectTo:'inventory-status',
        pathMatch:'full',
        data: { title: 'Inventory Status' }
      },
      {
        path: 'inventory-status', component: InventorystatusComponent,  data: { title: 'Inventory Status' }
       
      },
     {
      path: 'inventory-onhand', component: InventoryonhandComponent,  data: { title: 'On Hand' }
     },
     {
      path: 'inventory-purchaseorder', component: InventorypurchaseorderComponent,  data: { title: 'Purchase Order' }
     }
    ]
  }
];


   

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
