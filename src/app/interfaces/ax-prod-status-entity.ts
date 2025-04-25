export interface AxProdStatusEntity {
    axProdStatusId?: number;
    axProdStatusName?: string;
    tenantId?: number;
    createdBy?: number; 
   
}
  
  export class AxprodStatusSelectEntity {
    axProdStatusId?: number;
    tenantId?: number;
  
    constructor(init?: Partial<AxprodStatusSelectEntity>) {
      Object.assign(this, init);
    }
  }
  
  export class AxprodStatusDeleteEntity {
    axProdStatusId?: number;
    modifiedBy?: number;
  
    constructor(init?: Partial<AxprodStatusDeleteEntity>) {
      Object.assign(this, init);
    }
}
