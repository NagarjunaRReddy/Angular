import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { ActionStatusService } from '../../../production-planning/services/action-status.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActionResponsibleService } from '../../../production-planning/services/action-responsible.service';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  ActionResponsibleDeleteEntity,
  ActionResponsibleSelectEntity,
} from '../../../../interfaces/action-responsible-interface';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { ActionStatusDeleteEntity } from '../../../../interfaces/action-status-interface';
import { AddeditactionstatusComponent } from '../actionstatus/addeditactionstatus/addeditactionstatus.component';
import { AddeditactionresponsibleComponent } from './addeditactionresponsible/addeditactionresponsible.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actionresponsible',
  templateUrl: './actionresponsible.component.html',
  styleUrl: './actionresponsible.component.scss',
})
export class ActionresponsibleComponent {
  settings = {
    TableSettingsId: 3,
    RoleId: 6,
    IsScrollable: false,
    IsPagination: true,
    IsSorting: true,
    IsFilter: true,
    IsMultiselect: false,
    Pagination: true,
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };

  themeSettings = {
    RoleId: 6,

    ColourMode: 'light',
    ColourThemeSettingId: 1,
    PrimaryBackgroundColour: '#141bdb',
    SecondaryBackgroundColour: '#802836',
    PrimaryTextColour: '#000000',
    OnHoverColour: '#000000',
    TenantId: 1,
    CreatedBy: 1,
    CreatedOn: '2024-12-01T06:56:53.797',
    ModifiedBy: null,
    ModifiedOn: null,
  };
  frmactionStatus!: FormGroup;
  loadTable: boolean = false;
  displayedColumns: string[] = [];
  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allActionStatusMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  loginInfo: any;
  menuData: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  menuAccess: any;
  subMenuAccess: any;

  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private ActionResponsibleService: ActionResponsibleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginInfo = JSON.parse(
      this.helperService.getValue('LoginInfo') || '{}'
    );
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}');
    const table =
      sessionStorage.getItem('tableSettings') || JSON.stringify(this.settings);
    this.settings = JSON.parse(table);

    const theme =
      sessionStorage.getItem('themeSettings') ||
      JSON.stringify(this.themeSettings);
    this.themeSettings = JSON.parse(theme);

    this.loadTable = true;

    this.frmactionStatus = this.formBuilder.group({
      // excelsheet:[''],
      searchTab: [''],
    });

    this.getColumns();
    this.setMenuAccess();
  }

  setMenuAccess() {
    const routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
  
    if (this.menuAccess.length > 0) {
      const children = this.menuAccess[0].children;
  
      // Filter for the submenu that matches the current page
      this.subMenuAccess = children.filter((child: any) =>
        routerLink.includes(child.MenuPath)
      );
  
      console.log("Filtered SubMenuAccess:", this.subMenuAccess);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'Action Responsible',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };
    const siteService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            //this.displayedColumns = res.map((item: any) => item.DisplayName);
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            //this.columnNames = res.map((item: any) => item.ColumnName);
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action']; //here add what columns you want

            //'SiteId',
            // Include a "select" column if multiselect is enabled
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            
            // Fetch data only after initializing columns
            this.getActionStatus();

           
          }
        },
        (error: any) => {
          console.error('Error fetching master details:', error);
        }
      );

    this.subscribedService.push(siteService);
  }

  getActionStatus() {
    const ActionData: ActionResponsibleSelectEntity = {
      actionResponsibleId: 0,
      tenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
    };
    const AttachmenService = this.ActionResponsibleService.getAction(
      ActionData
    ).subscribe(
      (res: any) => {
        if (res != null && !res[0]?.Message) {
          this.allActionStatusMaster = res;
          const mappedData = res.map((item: any) => {
            const row: any = {};
            this.columnNames.forEach((col, index) => {
              row[col] = item[col] || '';
            });
            return row;
          });
          this.dataSource.data = res.map((item: any, idx: number) => {
            return {
              SlNo: idx + 1,
              ...item,
            };
          });
        }
      },
      (error) => {
        console.error('Some Error Occured', error);
      }
    );
    this.subscribedService.push(AttachmenService);
  }

  dateteItem(element: any, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let actionData: ActionResponsibleDeleteEntity = {
          actionResponsibleId: element.Id,
        };
        const ActionService = this.ActionResponsibleService.deleteAction(
          actionData
        ).subscribe(
          (res: any) => {
            if (res[0].SuccessMessage) {
              this.toster.success(res[0].SuccessMessage, 'Success');
            } else {
              this.toster.error(res[0].ErrorMessage, 'Error');
            }
            this.getActionStatus();
            window.location.reload();
          },
          (error) => {
            this.toster.error('Some Error Occured', 'ERROR');
          }
        );
        this.subscribedService.push(ActionService);
      }
    });
  }

  applyFilter(event: Event | string) {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditactionresponsibleComponent, {
      width: '35%',
      data: {
        title: 'Update Action Responsible',
        button: 'Update',
        view: false,
        value: element,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getActionStatus();
        }
      })
      .catch((error) => {
        this.toster.error('Error In Updating Action Responsible', 'ERROR');
      });
  }

  addAbcInventory(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddeditactionresponsibleComponent, {
      width: '35%',
      data: {
        title: 'Add Action Responsible',
        button: 'Save',
        view: false,
      },
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .toPromise()
      .then((result) => {
        if (result == true) {
          this.getActionStatus();
        }
      })
      .catch((error) => {
        this.toster.error('Error Occured', error);
      });
  }
}
