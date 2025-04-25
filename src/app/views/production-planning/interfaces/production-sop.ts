export interface IProductionSOP {
    tenantID:any;
    productionPlanningId:any;
    capacityId:any;
}

export interface IProductionAX {
    tenantID:any;
    capacityId:any;
}

export interface IProductionPlanSelectSoNumberEntity
{
    soNumber:any;
    TenantID:any;
}

export interface IProductionPlanActionInsertUpdate
{
    JsonData:string;
    TenantId:number;
    soNumber:string;
    Createdby:number;
}

export interface IProductionPlanGeneralInsertUpdate
{
    soNumber: string;
    categoryId: number;
    subcategoryId: number;
    customerName: string;
    dealerId: number;
    prdStartDate: any;
    deliveryDate: any;
    prdLineFinishDate:any;
    op10SubFrameStartDate:any;
    qcFinishDate:any;
    pumpPreWireDate:any;
    statusId: number;
    site: number;
    soldDate: any;
    prdStageId: number;
    salesStatusId: number;
    tenantId: number;
    createdby: number,
    chassisvin:string;
  }

export interface IProductionPlanDynamicInsertUpdate
{
    soNumber:string;
    itemId:any;
    vendorName:string;
    purchaseId:any;
    partsDeliveryDate:any;
    inventoryStatusId:any;
    inventoryItemNumber:any;
    referenceItemName:string;
    itemLt:number;
    rltDays:number;
    InventoryItemId:any;
    TenantId:number;
    Createdby:number;
    inventoryIId:string;
    serialNumber:string;
}

export interface IproductionplanAttachmentFileUplod
{
    Files?:File;
}

export interface IproductionplanAttachmentInsertUpdate
{
    soNumber?:any;
    json?:any;
    TenantId?:any;
    Createdby?:any;
}

export interface IproductionplanAttachmentDelete
{
    imageId?:any;
    soNumber?:any;
}

export interface IproductionplanAttachmentSelect
{
    tenantId?:any;
    soNumber?:any;
}
