export interface ActionStatusEntity{
    ActionStatusId: number;
    ActionStatusName: string;
    colorCode: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface ActionStatusDeleteEntity{
    ActionStatusId: number;
}

export interface ActionStatusSelectEntity{
    ActionStatusId: number;
    TenantID: number;
}