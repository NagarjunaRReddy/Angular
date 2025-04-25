export interface salesStatusEntities{
    salesStatusId:number;
    salesStatus:string;
    color:string;
    TenantId:number;
    createdBy:number;
}

export interface SelectSalesStatusEntitiy{
    salesStatusId:number;
    TenantId:number;
}

export interface DeleteSalesStatusEntity{
    salesStatusId:number;
}