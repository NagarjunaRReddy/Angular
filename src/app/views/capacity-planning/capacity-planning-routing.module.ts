import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapacityPlanningComponent } from './capacity-planning.component';

const routes: Routes = [
  {
    path : '' , component : CapacityPlanningComponent, data: { title: 'Capacity Planning' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacityPlanningRoutingModule { }
