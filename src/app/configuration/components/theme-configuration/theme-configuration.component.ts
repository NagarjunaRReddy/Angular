import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleSelectEntity } from '../../../interfaces/role-entity';
import { RoleService } from '../../../services/role.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { TenantService } from '../../../services/tenant.service';
import { TenantEntity } from '../../../interfaces/tenant-entity';
import { TablesettingService } from '../../../services/tablesetting.service';
import { ThemesettingsService } from '../../../services/themesettings.service';
import { BaseService } from '../../../base/base.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-configuration',
  templateUrl: './theme-configuration.component.html',
  styleUrl: './theme-configuration.component.scss'
})
export class ThemeConfigurationComponent {
  settings = {
    tableSettingsId:0,
    tenant: 0,
    role: 0,
    scrollable: true,
    pagination: false,
    sorting: false,
    filter: false,
    multiselect: false,
    createdBy:0,
  };
 


  themeSettings = {
    tenant: '',
    role: '',
    headerLogo: '',
    logoWidth: '',
    logoHeight: '',
    navBar: 'left'
  };

  colourThemeSettings = {
    colourMode: 'light',
    primaryBackgroundColour: '#4c89e1',
    secondaryBackgroundColour: '#d3e4fd',
    primaryTextColour: '#000000',
    secondaryTextColour: '#333333',
    onHoverColour: '#000000'
  };

  displayedColumns: string[] = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
  dataSource = new MatTableDataSource([
    { 'Column 1': 'Value 1', 'Column 2': 'Value 2', 'Column 3': 'Value 3', 'Column 4': 'Value 4' },
    { 'Column 1': 'Value A', 'Column 2': 'Value B', 'Column 3': 'Value C', 'Column 4': 'Value D' },
  ]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscribedService: Subscription[] = [];
  roleData: any;
  TenantData: any;

  unsubscribe$ = new Subject<void>();
  tableConfig: any = {};
  themeConfig: any[] = [];
  headersImage!: File;
  attachmentURL:string = "";
  headerLogo:string = "";
  themeSettingConfig: any = {};



  constructor(private cdr: ChangeDetectorRef,
    private roleService: RoleService,
    private tenantService:TenantService,
    private base:BaseService,
    private themeService:ThemesettingsService,
    private tService:ThemeService,
    private tablesettingService:TablesettingService){}

  ngOnInit(): void {
    try {
      this.getRole();
      this.getTenant();
      this.getTableSettings();
      this.getThemeSettings();
      this.getColorThemeSettings();
      this.attachmentURL = this.base.iconUrl;
    } catch (error) {
     
      //this.toastr.error('Error initializing component', 'ERROR');
    }
  }

  getTableSettings(){
    let data = {
      tenantId: 4,
      roleId: 4
    }

    this.tablesettingService.getTableSettingConfiguration(data).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next : (response:any) => {
        console.log(response);
        this.tableConfig = response[0]
        this.settings.filter = response[0].IsFilter
        this.settings.multiselect = response[0].IsMultiselect
        this.settings.pagination = response[0].IsPagination
        this.settings.sorting = response[0].IsSorting
        this.settings.scrollable = response[0].IsScrollable
      },
      error : (err:any) => {
          
      },
    })

  }

  getColorThemeSettings(){
    let data = {
      tenantId: 4,
      roleId: 4
    }

    this.themeService.getColorThemeSettingConfiguration(data).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next : (response:any) => {
        console.log(response);
        this.themeConfig = response;
        // this.headerLogo = this.attachmentURL + response[0].HeaderImage;
        // this.themeSettings.navBar = this.themeConfig.IsNavbarLeftOrTop ? 'top' : 'left';
        if(this.isDarkMode){
          this.colourThemeSettings.primaryBackgroundColour = this.themeConfig[1].PrimaryBackgroundColour
          this.colourThemeSettings.secondaryBackgroundColour = this.themeConfig[1].SecondaryBackgroundColour
          this.colourThemeSettings.primaryTextColour = this.themeConfig[1].PrimaryTextColour
          this.colourThemeSettings.onHoverColour = this.themeConfig[1].OnHoverColour;
          document.documentElement.style.setProperty('--primary-color', `${this.themeConfig[1].PrimaryBackgroundColour}`);
          document.documentElement.style.setProperty('--secondary-color', `${this.themeConfig[1].SecondaryBackgroundColour}`);
          document.documentElement.style.setProperty('--hover-color', `${this.themeConfig[1].OnHoverColour}`);
          document.documentElement.style.setProperty('--primary-text-color', `${this.themeConfig[1].PrimaryTextColour}`);
        }else{
          this.colourThemeSettings.primaryBackgroundColour = this.themeConfig[0].PrimaryBackgroundColour
          this.colourThemeSettings.secondaryBackgroundColour = this.themeConfig[0].SecondaryBackgroundColour
          this.colourThemeSettings.primaryTextColour = this.themeConfig[0].PrimaryTextColour
          this.colourThemeSettings.onHoverColour = this.themeConfig[0].OnHoverColour;
          document.documentElement.style.setProperty('--primary-color', `${this.themeConfig[0].PrimaryBackgroundColour}`);
          document.documentElement.style.setProperty('--secondary-color', `${this.themeConfig[0].SecondaryBackgroundColour}`);
          document.documentElement.style.setProperty('--hover-color', `${this.themeConfig[0].OnHoverColour}`);
          document.documentElement.style.setProperty('--primary-text-color', `${this.themeConfig[0].PrimaryTextColour}`);
        }
      },
      error : (err:any) => {
          
      },
    })

  }
  getThemeSettings(){
    let data = {
      tenantId: 4,
      roleId: 4
    }

    this.themeService.getThemeSettingConfiguration(data).pipe(takeUntil(this.unsubscribe$)).subscribe({
      next : (response:any) => {
        console.log(response);
        this.themeSettingConfig = response[0]
        this.headerLogo = this.attachmentURL + response[0].HeaderLogo;
        this.themeSettings.navBar = response[0].IsNavbarLeftOrTop == 'false' ? 'top' : 'left';
        this.themeSettings.logoHeight = response[0].LogoHeight;
        this.themeSettings.logoWidth = response[0].LogoWidth;
      },
      error : (err:any) => {
          
      },
    })

  }
  
  getTenant() {
   
      let tenantData: TenantEntity = {
        TenantId: 0
      }
      const tenantGetService = this.tenantService.getTenantData(tenantData)
        .subscribe((res: any) => {
          if (res.length != 0 && res != undefined) {
            this.TenantData = res;
            this.settings.tenant = res[0].TenantId;
            this.themeSettings.tenant = res[0].TenantId;
            console.log(this.TenantData,"this.TenantData")
          }
        },
          (error:any) => {
            //this.toastr.error("Some Error Occured", "ERROR");
          });
      this.subscribedService.push(tenantGetService);
    }
  
  getRole() {
    let roleData: RoleSelectEntity = {
      RoleId: 0,
      TenantID:1, //this.loginInfo.TenantId ? this.loginInfo.TenantId : 0
    }

    const roleGetService = this.roleService.getRole(roleData)
      .subscribe((res: any) => {
        if (res != undefined && res != null) {
          this.roleData = res;
          this.settings.role = res[0].RoleId
          this.themeSettings.role = res[0].RoleId
          console.log(this.roleData,"this.roleData")
        }
        else{
          this.roleData = new MatTableDataSource<any>();
        }
      },
        (error:any) => {
         // this.toastr.error("Some Error Occured", "ERROR");
        });
    this.subscribedService.push(roleGetService);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getColumns(): string[] {
    const columns = this.displayedColumns.slice();
    if (this.settings.multiselect) {
      columns.unshift('select');
    }
    return columns;
  }

  toggleSelectAll(event: any) {
    const isChecked = event.checked;
    this.dataSource.data.forEach((row: any) => (row.selected = isChecked));
  }

  resetSettings() {
    this.settings = {
    tableSettingsId:0,
    tenant: 0,
    role: 0,
    scrollable: true,
    pagination: false,
    sorting: false,
    filter: false,
    multiselect: false,
    createdBy:0,
    };
  }
 
  applySettings() {
    // If pagination is enabled
    if (this.settings.pagination) {
      this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource.paginator = null;
    }
    this.settings = {
      tableSettingsId: 0,
      tenant: 4,
      role: 4,
      scrollable: this.settings.scrollable,
      pagination: this.settings.pagination,
      sorting: this.settings.sorting,
      filter: this.settings.filter,
      multiselect: this.settings.multiselect,
      createdBy: 1,
    };
      // Call the service to save the settings
      console.log(JSON.stringify(this.settings));
      this.tablesettingService.InsertOrUpdateTableSettingConfiguration(this.settings).subscribe({
        next: (response) => {
         
          alert('Settings saved successfully!');
        },
        error: (error) => {
        
          alert('Error saving settings.');
        }
      });
  }

  onScrollableToggle(isScrollable: boolean): void {
    this.settings.scrollable = isScrollable;
    if (isScrollable) {
      this.settings.pagination = false; // Disable pagination when scrollable is enabled
    }else{
      this.settings.pagination = true;
    }
  }
  
  onPaginationToggle(isPagination: boolean): void {
    this.settings.pagination = isPagination;
    if (isPagination) {
      this.settings.scrollable = false; // Disable scrollable when pagination is enabled
    }else{
      this.settings.scrollable = true;
    }
  }

  toggleMode(event: Event): void {
    // Accessing the checked value of the checkbox
    const checkbox = event.target as HTMLInputElement;
    console.log(checkbox.value);
    
    this.isDarkMode = checkbox.checked;

    // You can perform any other actions based on the mode change.
    if (this.isDarkMode) {
      // Apply dark mode (e.g., change theme or class)
      // document.body.classList.add('dark-mode');
      this.colourThemeSettings.primaryBackgroundColour = this.themeConfig[1].PrimaryBackgroundColour
          this.colourThemeSettings.secondaryBackgroundColour = this.themeConfig[1].SecondaryBackgroundColour
          this.colourThemeSettings.primaryTextColour = this.themeConfig[1].PrimaryTextColour
          this.colourThemeSettings.onHoverColour = this.themeConfig[1].OnHoverColour;
      this.tService.saveTheme({
        primary: this.themeConfig[1].PrimaryBackgroundColour,
        secondary: this.themeConfig[1].SecondaryBackgroundColour,
        text: this.themeConfig[1].PrimaryTextColour,
        hover: this.themeConfig[1].OnHoverColour
      });
    } else {
      // Revert to light mode
      // document.body.classList.remove('dark-mode');
      this.colourThemeSettings.primaryBackgroundColour = this.themeConfig[0].PrimaryBackgroundColour
          this.colourThemeSettings.secondaryBackgroundColour = this.themeConfig[0].SecondaryBackgroundColour
          this.colourThemeSettings.primaryTextColour = this.themeConfig[0].PrimaryTextColour
          this.colourThemeSettings.onHoverColour = this.themeConfig[0].OnHoverColour;
      this.tService.saveTheme({
        primary: this.themeConfig[0].PrimaryBackgroundColour,
        secondary: this.themeConfig[0].SecondaryBackgroundColour,
        text: this.themeConfig[0].PrimaryTextColour,
        hover: this.themeConfig[0].OnHoverColour
      });
    }
  }
  

  onSortingToggle(event: any): void {
    console.log('Sorting toggled:', event);
    this.settings.sorting = event.target.checked;  // Update the sorting value based on checkbox
  
    // Ensure the sorting header updates
    if (this.settings.sorting) {
      this.dataSource.sort = this.sort;
      console.log('Sorting is enabled');
      this.cdr.detectChanges()
    } else {
      this.dataSource.sort = null;
      this.cdr.detectChanges()
      console.log('Sorting is disabled');
    }
  }

  onHeaderLogoFileSelected(event: any) {
    const file = event.target.files[0];

    const reader = new FileReader();
    this.headersImage = event.target.files[0];
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      console.log('Base64 string:', base64String);
      this.headerLogo = base64String;
      this.themeSettings.headerLogo = base64String;
      // Use the base64 string to set the form control value or display the image
      // this.configForm.patchValue({ backgroundImage: base64String });
    };
    reader.readAsDataURL(file);
  }
  
  onNavbarToggleChange(event: any): void {
    console.log('Checkbox toggled. Checked:', event.target.checked);
    console.log(this.themeSettings.navBar);
    if(event.target.checked){
      this.themeSettings.navBar = 'top'
    }else{
      this.themeSettings.navBar = 'left'
    }
    // You can perform additional logic here based on the event
  }

  // Getter for isNavbarRight, based on themeSettings.navBar value
  get isNavbarRight(): boolean {
    return this.themeSettings.navBar == 'top' ? true : false;
  }

  set isNavbarRight(value: boolean) {
    this.themeSettings.navBar = value ? 'top' : 'left';
  }

  get isDarkMode(): boolean {
    return this.colourThemeSettings.colourMode == 'dark' ? true : false;
  }

  set isDarkMode(value: boolean) {
    this.colourThemeSettings.colourMode = value ? 'dark' : 'light';
  }

  resetThemeSettings(){
    this.themeSettings = {
      tenant: '',
      role: '',
      headerLogo: '',
      logoWidth: '',
      logoHeight: '',
      navBar: 'top'
    };
  }
  applyThemeSettings(){
    console.log(this.themeSettings);
    let data = {
      tenantId: 4,
      roleId: 4
    }

    const formData = new FormData();
    formData.append('HeadersImage', this.headersImage, this.headersImage.name);

    // Append theme settings as query parameters
    formData.append('themeSettingEntity.RoleId', '4');
    formData.append('themeSettingEntity.ThemeSettingsId', this.themeSettingConfig.ThemeSettingsId);
    formData.append('themeSettingEntity.LogoHeight', this.themeSettings.logoHeight);
    formData.append('themeSettingEntity.LogoWidth', this.themeSettings.logoWidth );
    formData.append('themeSettingEntity.IsNavbarLeftOrTop', this.themeSettings.navBar == 'top' ? 'false' : 'true');
    formData.append('themeSettingEntity.TenantId', '4');

    this.themeService.InsertOrUpdateThemeSettingConfiguration(formData).subscribe({
      next: (response) => console.log('API Response:', response),
      error: (error) => console.error('API Error:', error),
    });
  }

  resetColorThemeSettings(){
    this.colourThemeSettings = {
      colourMode: 'light',
      primaryBackgroundColour: '#000000',
      secondaryBackgroundColour: '#000000',
      primaryTextColour: '#000000',
      secondaryTextColour: '#000000',
      onHoverColour: '#000000'
    };
    document.documentElement.style.setProperty('--primary-color', `${this.colourThemeSettings.primaryBackgroundColour}`);
    document.documentElement.style.setProperty('--secondary-color', `${this.colourThemeSettings.secondaryBackgroundColour}`);
    document.documentElement.style.setProperty('--primary-text-color', `${this.colourThemeSettings.primaryTextColour}`);
    document.documentElement.style.setProperty('--secondary-text-color', `${this.colourThemeSettings.secondaryTextColour}`);
    document.documentElement.style.setProperty('--hover-color', `${this.colourThemeSettings.onHoverColour}`);
  }

  saveColorThemeSettings(){
    console.log(this.colourThemeSettings);
    document.documentElement.style.setProperty('--primary-color', `${this.colourThemeSettings.primaryBackgroundColour}`);
    document.documentElement.style.setProperty('--secondary-color', `${this.colourThemeSettings.secondaryBackgroundColour}`);
    document.documentElement.style.setProperty('--hover-color', `${this.colourThemeSettings.onHoverColour}`);
    document.documentElement.style.setProperty('--primary-text-color', `${this.colourThemeSettings.primaryTextColour}`);
    document.documentElement.style.setProperty('--secondary-text-color', `${this.colourThemeSettings.secondaryTextColour}`);

    const themeSettings = {
      roleId: 4,
      colourMode: this.isDarkMode ? 'dark' : 'light',
      colourThemeSettingId: !this.isDarkMode ? this.themeConfig[0].ColourThemeSettingsId : this.themeConfig[1].ColourThemeSettingsId ,
      primaryBackgroundColour: this.colourThemeSettings.primaryBackgroundColour,
      secondaryBackgroundColour: this.colourThemeSettings.secondaryBackgroundColour,
      primaryTextColour: this.colourThemeSettings.primaryTextColour,
      onHoverColour: this.colourThemeSettings.onHoverColour,
      tenantId: 4,
      createdBy: 0
    };
    

    this.themeService.InsertOrUpdateColorThemeSettingConfiguration(themeSettings).subscribe({
      next: (response) => console.log('API Response:', response),
      error: (error) => console.error('API Error:', error),
    });

  }

}
