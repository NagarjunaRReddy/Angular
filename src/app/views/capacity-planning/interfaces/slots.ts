export interface SlotEntity {
    slotId: number;
    slotName?: string;
    slotDesc?: string;
    createdBy: number;
    modifiedBy?: number;
    tenantId: number;
}

export interface SlotSelectEntity {
    CapacityId: number;
    BucketId: number;
    SlotId: number;
    TenantId: number;
}

export interface SlotDeleteEntity {
    slotId: number;
    tenantId: number;
}