export interface Themesettingsentity {
    themeSettingsId?: number;
    roleId?: number;
    headerImage?: string;
    isNavbarLeftOrTop?: boolean;
    primaryBackgroundColour?: string;
    secondaryBackgroundColour?: string;
    primaryTextColour?: string;
    onHoverColour?: string;
    tenantId?: number;
}
export interface SelectThemeEntity {
    tenantId?: number;
  }
  
  export interface ThemeSettingDto {
    themeSettingEntity?: Themesettingsentity;
    headersImage?: File;
  }
