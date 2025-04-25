export interface ActionResponsibleEntity {
    ActionResponsibleId: number;
    actionResponsibleName?: string;
    tenantId: number;
    createdBy: number;
    modifiedBy?: number;
}

export interface ActionResponsibleDeleteEntity {
    actionResponsibleId: number;
}

export interface ActionResponsibleSelectEntity {
    actionResponsibleId: number;
    tenantID: number;
}
