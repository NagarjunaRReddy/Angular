export interface TruckStatusEntity {
    TruckStatusId: number;
    TruckStatusName?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}
export interface TruckStatusDeleteEntity {
    TruckStatusId: number;
}
export interface TruckStatusSelectEntity {
    TruckStatusId: number;
    TenantID: number;
}
