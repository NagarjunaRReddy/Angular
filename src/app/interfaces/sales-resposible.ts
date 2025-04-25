export interface SalesResposible {
    salesResposibleId?: number;  
    salesResponsibleName?: string; 
    tenantId?: number;
    createdBy?: number;
    modifiedBy?:number;
}
export interface SalesResposibleSelectEntity {
    salesResposibleId?: number;
    tenantId?: number;
  }
  export interface SalesResponsibleDeleteEntity {
    salesResposibleId?: number;
    modifiedBy?: number;
  }