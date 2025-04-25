export interface SpecreviewstatusEntity {
    SpecreviewstatusId: number;
    specreviewstatusName?: string;
    ColorCode?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface SpecreviewstatusDeleteEntity {
    SpecreviewstatusId: number;
}

export interface SpecreviewstatusSelectEntity {
    SpecreviewstatusId: number;
    TenantID: number;
}
