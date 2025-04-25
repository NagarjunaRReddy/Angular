import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './components/sales-order/sales-order.component';

const routes: Routes = [
  {
    path : '' , component : SalesOrderComponent, data: { title: 'Sales Order' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule { }
