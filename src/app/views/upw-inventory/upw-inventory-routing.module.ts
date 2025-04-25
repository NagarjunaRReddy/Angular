import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemandComponent } from './components/demand/demand.component';
import { OnhandComponent } from './components/onhand/onhand.component';
import { PurchaseorderComponent } from './components/purchaseorder/purchaseorder.component';

const routes: Routes = [
{

  path : '' , component : DemandComponent, data: { title: 'Demand' },
    children: [
      {
        path: '', redirectTo:'demand', pathMatch:'full', data: { title: 'Demand' }
      },
      {
        path: 'onhand', component: OnhandComponent,  data: { title: 'On Hand' }
       
      },
     {
      path: 'purchaseorder', component: PurchaseorderComponent,  data: { title: 'On Hand' }
     }
    
    ]
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpwInventoryRoutingModule { }
