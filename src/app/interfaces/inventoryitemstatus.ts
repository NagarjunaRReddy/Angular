export interface Inventoryitemstatus {
    InventoryItemId: number;
    ItemStatus?: string;
    ItemColor?: string;
    ItemPriority: number;
    TenantId: number;
    CreatedBy: number;
    ModifiedBy?: number;
}

export interface InventoryItemStatusSelectEntity {
    InventoryItemId: number;
    TenantId: number;
}

export interface InventoryItemStatusDeleteEntity {
    InventoryItemId: number;
}
