export interface RoleEntity {
    RoleId: number;
    RoleName: string;
    RoleDescription: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
    RolePermissionJson?: any;
}
export interface RoleDeleteEntity {
    RoleId: number;
}

export interface RolePermissionSelectEntity {
    roleId: number;
}

export interface RolePermissionEntity {
    RoleId: any;
    RolePermissionJson?: any;
    CreatedBy: any;
}

export interface RoleSelectEntity{
    RoleId: number;
    TenantID: number;
}

export interface RolePermissionLeftMenuEntity{
    RoleId: number;
}