import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './components/user-management/user/user.component';
import { Title } from '@angular/platform-browser';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { RoleComponent } from './components/user-management/role/role.component';


const routes: Routes = [
  {
    path:'',component:UserManagementComponent,
    data: {title:'User Management'},
    children:[
      {
        path:'',
        redirectTo:'user',
        pathMatch:'full',
        data:{title:'User'}
      },
      {
        path:'user',
        component:UserComponent,
        data:{title:'User'}
      },
      {
        path:'role',
        component:RoleComponent,
        data:{title:'Roles'}
      }
    ]
  },
  // {
  //   path:'',
  //   component:UserComponent,
  //   data:{Title:'user'}
  // },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
