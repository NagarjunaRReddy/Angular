export interface CapacityArea {
    CapacityId: number;
    CapacityName?: string;
    CreatedBy: number;
    ModifiedBy?: number;
    TenantId: number;
}
export interface CapacityAreaSelectEntity {
    CapacityId: number;
    TenantId: number;
}

export interface CapacityAreaDeleteEntity {
    CapacityId: number;
    TenantId: number;
}
export interface CapacityAreaResponse {
    Table1: any[]; // Replace `any` with the appropriate type based on your use case.
    // Add other properties that you esxpect in the response.
}

export interface DropEntity{
    CapacityId?: number;
    bucketId?: number;
    SlotId?: number;
    TenantId?: number;
    Flag?: number;
}
export interface CapacityAreaSaveEntity{
    flag?: number;
    TenantId?: number;
    CreatedBy?: number;
    JsonData?: any;
}

export interface BucketSaveEntity{
    flag?: number;
    TenantId?: number;
    CapacityId?: number;
    CreatedBy?: number;
    JsonData?: any;
}

export interface SlotSaveEntity{
    flag?: number;
    TenantId?: number;
    CapacityId?: number;
    CreatedBy?: number;
    JsonData?: any;
    BucketPlanningFormattedDatesId?: number;
}

export interface ISharedEntity {
    CapacityId?: number;
    BucketId?: number;
    SlotId?: number;
}