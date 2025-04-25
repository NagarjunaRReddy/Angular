export interface UserEntity {
    UserId: number;
    FirstName?: string | null;
    LastName?: string | null;
    EmailId?: string | null;
    Designation?: string | null;
    Password?: string | null;
    ConfirmPassword?: string | null;
    RoleId: number;
    ActiveStatus: number;
    ContactNo?: string | null;
    Address?: string | null;
    TenantId: number;
    LanguageId: number;
    UserBusinessDetails:BusinessUnit[];
  }

  export interface BusinessUnit{
    BusinessUnitId:number;
    BusinessUnit:string;
  }

  export interface UserDeleteEntity {
    UserId: number;
  }
  export interface UserSelectEntity {
    UserId: number;
    TenantID: number;
  }
      