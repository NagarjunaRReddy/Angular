import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { HelperService } from '../../../../services/helper.service';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { PrdStageService } from '../../../production-planning/services/prd-stage.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import {
  PRDStageDeleteEntity,
  PRDStageSelectEntity,
} from '../../../../interfaces/prd-stage-interface';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddEditPrdStageComponent } from './add-edit-prd-stage/add-edit-prd-stage.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prd-stage',
  templateUrl: './prd-stage.component.html',
  styleUrl: './prd-stage.component.scss',
})
export class PrdStageComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  frmprdstage!: FormGroup;
  loadTable: boolean = false;
  displayedColumns: string[] = [];
  loginInfo: any;
  columnNames: string[] = [];
  subscribedService: Subscription[] = [];
  allprdstageMaster: any[] = [];
  mappedData: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
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
  menuData: any;
  menuAccess: any;
  subMenuAccess: any;
  constructor(
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private masterdetailsService: MasterdetailsService,
    private prdstageService: PrdStageService,
    private dialog: MatDialog,
    private toster: ToastrService,
    private router: Router,  ) {}
  ngOnInit(): void {
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

    this.frmprdstage = this.formBuilder.group({
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
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getColumns(): void {
    const masterDetailsEntity: MasterDetailsEntity = {
      MasterName: 'PRDStage',
      TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };

    const prdstageService = this.masterdetailsService
      .getMasterDetailsByName(masterDetailsEntity)
      .subscribe(
        (res: any) => {
          if (!res[0]?.Message) {
            this.displayedColumns = res.map((itm) => itm.DisplayName);
            this.columnNames = res.map((item) => item.ColumnName);
            this.columnNames = ['Sl.No.', ...this.columnNames, 'Action'];
            if (this.settings.IsMultiselect) {
              this.displayedColumns.unshift('select');
            }
            // Fetch data only after initializing columns
            this.getprdstageMaster();
          }
        },
        (error: any) => {
          //console.error('Error fetching master details:', error);
          this.toster.error(error);
        }
      );

    this.subscribedService.push(prdstageService);
  }

  getprdstageMaster() {
    const prdData: PRDStageSelectEntity = {
      PRDStageId: 0,
      TenantID: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1, // Replace dynamically if needed
    };

    const prdstageGetService = this.prdstageService.getPrd(prdData).subscribe(
      (res: any) => {
        if (res && res.length && !res[0]?.Message) {
          this.allprdstageMaster = res;
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
        // console.error("Some error occurred", error);
        this.toster.error(error);
      }
    );

    this.subscribedService.push(prdstageGetService);
  }

  deleteItem(element: any, event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '30%', // Adjust the width as needed
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want to delete?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        let prdData: PRDStageDeleteEntity = {
          PRDStageId: element.Id,
        };
        const PrdstagemasterService = this.prdstageService
          .deletePrd(prdData)
          .subscribe(
            (res: any) => {
              if (res[0].SuccessMessage) {
                this.toster.success(res[0].SuccessMessage, 'Success');
              } else {
                this.toster.error(res[0].ErrorMessage, 'Error');
              }
              window.location.reload();
              this.getprdstageMaster();
            },
            (error) => {
              this.toster.error('Some Error Occured', 'ERROR');
            }
          );
        this.subscribedService.push(PrdstagemasterService);
      }
    });
  }

  editItem(element: any, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditPrdStageComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Update PRD Stage',
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
          this.getprdstageMaster();
        }
      })
      .catch((error) => {
        // console.error('Error occurred:', error);
        this.toster.error(error);
      });
  }
  addPrdStage(event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddEditPrdStageComponent, {
      width: '35%', // Adjust the width as needed
      data: {
        title: 'Add PRD Stage',
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
          this.getprdstageMaster();
        }
      })
      .catch((error) => {
        // console.error('Error occurred:', error);
        this.toster.error(error);
      });
  }

  applyFilter(event: Event | string) {
    const filterValue =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
