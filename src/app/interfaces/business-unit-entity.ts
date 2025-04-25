export interface BusinessUnitEntity {
    BusinessUnitId: number;
    BusinessUnitName?: string;
    Capacity?:string;
    IconName?:string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
    Attachments?:any
}
export interface BusinessUnitSelectEntity {
    BusinessUnitId: number;
    TenantId: number;
}

export interface BusinessUnitDeleteEntity {
    BusinessUnitId: number;
}
export interface BusinessUnitEntityDTO {
    BusinessUnitEntityData: BusinessUnitEntity;
    Files: File[];
  }