export interface ProductionPool {
    productionPoolId?: number;  
    productionPool?: string; 
    siteId?: number;
    tenantId?: number;
    createdBy?: number;
}
export interface ProductionPoolDeleteEntity {
    productionPoolId: number;  
    // modifiedBy:number;
  }

  export interface ProductionPoolSelectEntity {
    productionPoolId: number;
    tenantId: number;
  }
