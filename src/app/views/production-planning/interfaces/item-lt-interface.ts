export interface ItemLTEntity {
    ItemLTId: number;
    ItemLTName?: string;
    ItemLTDescription?: string;
    LTDays: number;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface ItemLTDeleteEntity {
    ItemLTId: number;
}

export interface ItemLTSelectEntity {
    ItemLTId: number;
    TenantID: number;
}
