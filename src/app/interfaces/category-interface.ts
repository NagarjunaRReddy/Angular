export interface CategoryEntity {
    CategoryId: number;
    CategoryName: string | null;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface CategorySelectEntity {
    CategoryId: number;
    TenantID: number;
}

export interface CategoryDeleteEntity {
    categoryId: number;
}