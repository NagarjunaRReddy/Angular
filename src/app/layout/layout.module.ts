import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TopNavMenuComponent } from './components/top-nav-menu/top-nav-menu.component';
import { CapacityPlanningModule } from '../views/capacity-planning/capacity-planning.module';



@NgModule({
  declarations: [
    LayoutComponent,
    SideNavComponent,
    TopNavComponent,
    TopNavMenuComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    CapacityPlanningModule
  ]
})
export class LayoutModule { }
