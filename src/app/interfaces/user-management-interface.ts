export interface TenantSelectEntity{
    TenantId: number;
}

export interface RoleSelectEntity{
    RoleId: number;
    TenantID: number;
}

export interface BusinessSelectEntity{
    BusinessUnitId:number;
    TenantId:number;
}
