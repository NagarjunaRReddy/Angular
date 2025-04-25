import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionPlanningComponent } from './production-planning.component';
import { AxProductionPlanningComponent } from './ax-production-planning/ax-production-planning.component';
import { SopProductionPlanningComponent } from './sop-production-planning/sop-production-planning.component';

const routes: Routes = [
  {
    path : '' , component : ProductionPlanningComponent, data: { title: 'Production Planning' },
    children: [
      { path: 'main', redirectTo: 'sop-production', pathMatch: "full" },
      { path: 'ax-production/:id', component: AxProductionPlanningComponent },
      { path: 'sop-production/:id', component: SopProductionPlanningComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionPlanningRoutingModule { }
