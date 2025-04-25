import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ColorReportComponent } from './components/color-report/color-report.component';

const routes: Routes = [
  {
    path : '' , component : ColorReportComponent, data: { title: 'Color Report' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ColorReportRoutingModule { }
