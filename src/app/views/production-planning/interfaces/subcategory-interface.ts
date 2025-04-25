export interface SubCategoryEntity {
    CategoryId: number;
    SubCategoryId: number;
    SubCategoryName: string | null;
    prodLTdays: number;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}
export interface SubCategoryDeleteEntity {
    SubCategoryId: number;
}
export interface SubCategorySelectEntity {
    SubCategoryId: number;
    TenantID: number;
}
