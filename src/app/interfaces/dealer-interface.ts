export interface DealersEntity {
    DealerId: number;
    DealerName?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}
export interface DealersDeleteEntity {
    DealerId: number;
}
export interface DealersSelectEntity {
    DealerId: number;
    TenantID: number;
}
