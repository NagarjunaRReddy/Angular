export interface BOMStatusEntity {
    BOMStatusId: number;
    BOMStatusName?: string;
    ColorCode?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface BOMStatusDeleteEntity {
    BOMStatusId: number;
}

export interface BOMStatusSelectEntity {
    BOMStatusId: number;
    TenantID: number;
}

