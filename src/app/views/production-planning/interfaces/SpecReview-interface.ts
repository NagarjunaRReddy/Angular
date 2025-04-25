export interface SpecReviewBOMCOEntity {
    SpecReviewBOMCOId: number;
    SalesOrderId: number;
    BOMDate?: string;
    BOMStatusId?: number;
    ChangeOrderDate?: string;
    ChangeOrderStatusId?: number;
    SpecReviewDate?: string;
    SpecReviewStatusId?: number;
    CreatedBy: number;
    ModifiedBy?: number;
    TenantId: number;
    //Comments?: string;
    SpecReviewComments?: string;
    BOMComments?: string;
    ChangeOrderComments?: string;
    Action?: string;
}

export interface SpecReviewBOMCOSelectEntity {
    SpecReviewBOMCOId: number;
    TenantID: number;
    Action?: string;
}
