import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { UserComponent } from './components/user-management/user/user.component';
import { AddEditUserComponent } from './components/user-management/user/add-edit-user/add-edit-user.component';
import { RoleComponent } from './components/user-management/role/role.component';
import { AddEditRoleComponent } from './components/user-management/role/add-edit-role/add-edit-role.component';
import { RolePermissionComponent } from './components/user-management/role/role-permission/role-permission.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../shared/guard/auth.interceptor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserComponent,
    AddEditUserComponent,
    RoleComponent,
    AddEditRoleComponent,
    RolePermissionComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatIconModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    SharedModule,
    FormsModule,
    MatTooltipModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class UsersModule {}
