import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BigPartsComponent } from './big-parts.component';

const routes: Routes = [
  {
    path : '' , component : BigPartsComponent, data: { title: 'Big Parts' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigPartsRoutingModule { }
