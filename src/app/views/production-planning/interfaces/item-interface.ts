export interface ItemMasterEntity {
    ItemMasterId: number;
    ItemMasterName?: string;
    ItemMasterDescription?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface ItemMasterDeleteEntity {
    ItemMasterId: number;
}

export interface ItemMasterSelectEntity {
    ItemMasterId: number;
    TenantID: number;
}
