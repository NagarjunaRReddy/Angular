export interface Siteentity {
    SiteId: number;
    SiteName?: string;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}
export interface SiteDeleteEntity {
    SiteId: number;
}
export interface SiteSelectEntity {
    SiteId: number;
    TenantId?: number;
    // TenantID?: number;
}