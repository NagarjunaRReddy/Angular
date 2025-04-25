import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionLogComponent } from './components/action-log/action-log.component';

const routes: Routes = [
  {
    path: '',
    component: ActionLogComponent,
    data: { title: 'Action Log' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionLogRoutingModule {}
