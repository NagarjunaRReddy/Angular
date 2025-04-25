export interface COStatusEntity {
    CustomerOrderStatusId: number;
    CustomerOrderStatusName?: string;
    ColorCode?: string;
    priority?: number;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface COStatusDeleteEntity {
    CustomerOrderStatusId: number;
}
export interface COStatusSelectEntity {
    CustomerOrderStatusId: number;
    TenantID: number;
}
