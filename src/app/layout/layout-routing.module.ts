import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const loginInfo = JSON.parse(sessionStorage.getItem('LoginInfo') || '{}');

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'sales-order',
        loadChildren: () => import('../views/sales-order/sales-order.module').then(m => m.SalesOrderModule),
        data: { title: 'Sales Order' }
      },
      {
        path: 'big-parts',
        loadChildren: () => import('../views/big-parts/big-parts.module').then(m => m.BigPartsModule),
        data: { title: 'Big Parts' }
      },
      {
        path: 'inventory',
        loadChildren: () => import('../views/inventory/inventory.module').then(m => m.InventoryModule),
        data: { title: 'Inventory' }
      },
      {
        path: 'upwinventory',
        loadChildren: () => import('../views/upw-inventory/upw-inventory.module').then(m => m.UpwInventoryModule),
        data: { title: 'UPW Inventory' }
      },
      {
        path: 'masters',
        loadChildren: () => import('../views/master/master.module').then(m => m.MasterModule),
        data: { title: 'Masters' }
      },
      {
        path: 'capacity-planning',
        loadChildren: () => import('../views/capacity-planning/capacity-planning.module').then(m => m.CapacityPlanningModule),
        data: { title: 'Capacity Planning' }
      },
      {
        path: 'color-report',
        loadChildren: () => import('../views/color-report/color-report.module').then(m => m.ColorReportModule),
        data: { title: 'Color Report' }
      },
      {
        path: 'production-planning',
        loadChildren: () => import('../views/production-planning/production-planning.module').then(m => m.ProductionPlanningModule),
        data: { title: 'Production Planning' }
      },
      {
        path: 'action-log',
        loadChildren: () =>
          import('../views/action-log/action-log.module').then(
            (m) => m.ActionLogModule
          ),
        data: { title: 'Action Log' },
      },
      {
        path: 'configuration',
        loadChildren: () => import('../configuration/configuration.module').then(m => m.ConfigurationModule),
        data: { title: 'Configuration Settings' }
      },
      {
        path: 'users',
        loadChildren: () => import('../views/users/users.module').then(m => m.UsersModule),
        data: { title: 'User Management' }
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: loginInfo.Menu_Path
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
