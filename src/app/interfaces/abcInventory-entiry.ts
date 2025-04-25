export interface AbcInventory{
    abcInventoryId:number,
    abcInventoryName:string,
    tenantId:number,
    createdBy:number,
    modifiedBy?:number,
}
export interface selectAbcInventory{
    abcInventoryId:number;
    TenantId?: number;

}
export interface AbcInventoryDelete{
    abcInventoryId:number;
}