export interface PRDStageEntity{
    PRDStageId: number;
    PRDStageName: string;
    PRDColor: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?:number;
}

export interface PRDStageDeleteEntity{
    PRDStageId: number;
}

export interface PRDStageSelectEntity{
    PRDStageId: number;
    TenantID: number;
}