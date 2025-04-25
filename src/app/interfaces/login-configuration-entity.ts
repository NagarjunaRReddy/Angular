export interface LoginConfigurationEntity {
    loginConfigurationId?: number;
    backgroundType?: boolean;
    backgroundColor?: string;
    formBackgroundColor?: string;
    textColor?: string;
    formAlignment?: number;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    logoImage?: string;
    backgroundImage?: string;
    bussinessUnitId?: number;
    tenantId?: number;
}
export interface LoginConfigurationSelect {
    tenantId?: number;
}

export interface LoginConfigurationDto {
    loginConfiguration?: LoginConfigurationEntity;
    backgroundImage?: File;
    logoImage?: File;
}
