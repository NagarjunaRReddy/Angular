export interface AttachmentStatusEntiti{
    attachmentStatusId:number;
    attachmentStatus:string;
    color:string;
    TenantId:number;
    createdBy:number;
}

export interface SelectAttachMentStatus{
    attachmentStatusId:number;
    TenantId:number;
}
export interface DeleteAttachmentStatus{
    attachmentStatusId:number;
}