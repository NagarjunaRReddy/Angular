export interface BucketEntity {
    BucketId: number;
    BucketName?: string;
    Note?: string;
    CreatedBy: number;
    ModifiedBy?: number;
    TenantId: number;
}

export interface BucketSelectEntity {
    CapacityId: number;
    BucketId: number;
    TenantId: number;
    Capacity:string;
}

export interface BucketDeleteEntity {
    BucketId: number;
    TenantId: number;
}
export interface BucketPlanningInsertSelect
{
    StartDate?:Date;
    EndDate?:Date;
    Flag?:number;
    BuId?:number;
    Exclude ?:any;   
    CreatedBy?:number;
    ModifiedBy?:number;
    TenantId?:number;
    BucketPlanningDaysWeekMonthId?:number;
    BucketPlanningFormattedDatesId?:number;
}
export class BucketPlanningDaysWeekMonth {
    bucketPlanningDaysWeekMonthId?: number; // Primary Key
    businessUnitId?: number;
    flag?: number;
    startDate?: Date;
    endDate?: Date;
    totalDays?: number; // Nullable
    totalWeeks?: number; // Nullable
    totalMonths?: number; // Nullable
    tenantId?: number;
    createdBy?: number; // Nullable
   
    modifiedBy?: number; // Nullable
  
    // Related BucketPlanningFormattedDates
    formattedDates?: BucketPlanningFormattedDates[];
  
    constructor(init?: Partial<BucketPlanningDaysWeekMonth>) {
      Object.assign(this, init);
    }
  }
  export class BucketPlanningFormattedDates {
    bucketPlanningFormattedDatesId?: number; // Primary Key
    formattedDates?: Date;
    bucketPlanningDaysWeekMonthId?: number; // Foreign Key
    weekNumber?: number;
  
    constructor(init?: Partial<BucketPlanningFormattedDates>) {
      Object.assign(this, init);
    }
  }