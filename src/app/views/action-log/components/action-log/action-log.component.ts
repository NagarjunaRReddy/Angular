import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HelperService } from '../../../../services/helper.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';
import { AddEditGenericActionComponent } from '../../models/add-edit-generic-action/add-edit-generic-action.component';

export interface SalesData {
  salesId: string;
  actions: string;
  responsible: string;
  actionDate: string;
  targetDate: string;
  status: string;
}
const Specific_data_source: any[] = [
  {
    salesId: 'SO-074094',
    actions: 'Myriam needs onspot forms',
    responsible: 'Cody Jacobs',
    actionDate: '01/06/25',
    targetDate: '01/15/25',
    status: 'Open',
  },
  {
    salesId: 'SO-077021',
    actions: 'ORDER PUMP CPQ 2026',
    responsible: 'Randy Brummel',
    actionDate: '12/11/24',
    targetDate: '01/10/25',
    status: 'Open',
  },
  {
    salesId: 'SO-078112',
    actions: 'Follow up on quote request',
    responsible: 'Alice Johnson',
    actionDate: '02/15/25',
    targetDate: '02/22/25',
    status: 'In Progress',
  },
  {
    salesId: 'SO-079223',
    actions: 'Schedule product demo',
    responsible: 'Bob Williams',
    actionDate: '03/01/25',
    targetDate: '03/08/25',
    status: 'Open',
  },
  {
    salesId: 'SO-080334',
    actions: 'Negotiate contract terms',
    responsible: 'Cody Jacobs',
    actionDate: '03/10/25',
    targetDate: '03/17/25',
    status: 'In Progress',
  },
  {
    salesId: 'SO-081445',
    actions: 'Prepare sales proposal',
    responsible: 'Alice Johnson',
    actionDate: '04/05/25',
    targetDate: '04/12/25',
    status: 'Open',
  },
  {
    salesId: 'SO-082556',
    actions: 'Send follow-up email',
    responsible: 'Randy Brummel',
    actionDate: '04/15/25',
    targetDate: '04/22/25',
    status: 'Closed',
  },
  {
    salesId: 'SO-083667',
    actions: 'Update CRM with notes',
    responsible: 'Bob Williams',
    actionDate: '05/01/25',
    targetDate: '05/08/25',
    status: 'Open',
  },
  {
    salesId: 'SO-084778',
    actions: 'Request customer feedback',
    responsible: 'Cody Jacobs',
    actionDate: '05/10/25',
    targetDate: '05/17/25',
    status: 'In Progress',
  },
  {
    salesId: 'SO-085889',
    actions: 'Close the deal',
    responsible: 'Alice Johnson',
    actionDate: '06/01/25',
    targetDate: '06/08/25',
    status: 'Open',
  },
  {
    salesId: 'SO-086990',
    actions: 'Onboard new customer',
    responsible: 'Randy Brummel',
    actionDate: '06/15/25',
    targetDate: '06/22/25',
    status: 'Open',
  },
  {
    salesId: 'SO-082526',
    actions: 'Send follow-up email',
    responsible: 'Manuel',
    actionDate: '04/15/25',
    targetDate: '04/22/25',
    status: 'Closed',
  },
  {
    salesId: 'SO-087001',
    actions: 'Renew contract',
    responsible: 'Bob Williams',
    actionDate: '07/01/25',
    targetDate: '07/08/25',
    status: 'Open',
  },
];

interface GenericData {
  slNo: string;
  actions: string;
  responsible: string;
  actionDate: string;
  targetDate: string;
  status: string;
}

const Generic_data_source: any[] = [
  {
    slNo: 'SO-074100',
    actions: 'Initial contact with Acme Corp',
    responsible: 'Alice Johnson',
    actionDate: '01/08/25',
    targetDate: '01/17/25',
    status: 'Open',
  },
  {
    slNo: 'SO-077030',
    actions: 'Qualify lead for Beta Project',
    responsible: 'Bob Williams',
    actionDate: '12/13/24',
    targetDate: '01/12/25',
    status: 'Open',
  },
  {
    slNo: 'SO-078120',
    actions: 'Send product information to Gamma Inc.',
    responsible: 'Cody Jacobs',
    actionDate: '02/17/25',
    targetDate: '02/24/25',
    status: 'In Progress',
  },
  {
    slNo: 'SO-079230',
    actions: 'Schedule follow-up call with Delta Ltd.',
    responsible: 'Randy Brummel',
    actionDate: '03/03/25',
    targetDate: '03/10/25',
    status: 'Open',
  },
  {
    slNo: 'SO-080340',
    actions: 'Prepare quote for Epsilon Systems',
    responsible: 'Alice Johnson',
    actionDate: '03/12/25',
    targetDate: '03/19/25',
    status: 'In Progress',
  },
  {
    slNo: 'SO-081450',
    actions: 'Negotiate pricing with Zeta Solutions',
    responsible: 'Bob Williams',
    actionDate: '04/07/25',
    targetDate: '04/14/25',
    status: 'Open',
  },
  {
    slNo: 'SO-082560',
    actions: 'Send contract to Eta Industries',
    responsible: 'Cody Jacobs',
    actionDate: '04/17/25',
    targetDate: '04/24/25',
    status: 'Closed',
  },
  {
    slNo: 'SO-083670',
    actions: 'Confirm order details with Theta Corp',
    responsible: 'Randy Brummel',
    actionDate: '05/03/25',
    targetDate: '05/10/25',
    status: 'Open',
  },
  {
    slNo: 'SO-084780',
    actions: 'Schedule product training for Iota Group',
    responsible: 'Alice Johnson',
    actionDate: '05/12/25',
    targetDate: '05/19/25',
    status: 'In Progress',
  },
  {
    slNo: 'SO-085890',
    actions: 'Prepare onboarding materials for Kappa Inc.',
    responsible: 'Bob Williams',
    actionDate: '06/03/25',
    targetDate: '06/10/25',
    status: 'Open',
  },
  {
    slNo: 'SO-086900',
    actions: 'Follow up on customer satisfaction with Lambda Systems',
    responsible: 'Cody Jacobs',
    actionDate: '06/17/25',
    targetDate: '06/24/25',
    status: 'Open',
  },
  {
    slNo: 'SO-082530',
    actions: 'Request feedback from Mu Industries',
    responsible: 'Randy Brummel',
    actionDate: '04/20/25',
    targetDate: '04/27/25',
    status: 'Closed',
  },
  {
    slNo: 'SO-087010',
    actions: 'Renew contract with Nu Corp',
    responsible: 'Alice Johnson',
    actionDate: '07/03/25',
    targetDate: '07/10/25',
    status: 'Open',
  },
];

export default Generic_data_source;

@Component({
  selector: 'app-action-log',
  templateUrl: './action-log.component.html',
  styleUrl: './action-log.component.scss',
})
export class ActionLogComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable, { static: false }) table!: MatTable<any>;

  actionLogForm!: FormGroup;
  activeTab: string = 'Specific Action';

  specificDisplayedColumns: string[] = [
    'salesId',
    'actions',
    'responsible',
    'actionDate',
    'targetDate',
    'status',
    'action',
  ];
  genericDisplayedColumns: string[] = [
    'slNo',
    'actions',
    'responsible',
    'actionDate',
    'targetDate',
    'status',
    'action',
  ];

  specificDataSource = new MatTableDataSource<any>(Specific_data_source);
  genericDataSource = new MatTableDataSource<any>(Generic_data_source);
  allSiteMaster: any[] = [];
  allBusinessMaster: any[] = [];
  public dataSourceSearch: any[] = [];
  minToDate: string | null | any = null;
  menuData: any;
  menuAccess: any;
  allProductionStatusData: any[] = [];
  loadTable: boolean = false;
  activeIndex: string = 'All';
  activeCategory: string = 'All';
  activeLink: any;

  constructor(
    private fb: FormBuilder,
    private helper: HelperService,
    public datepipe: DatePipe,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '{}');
    this.loadTable = true;

    this.actionLogForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      responsible: [0],
      actionStatus: [0],
      searchTab: [''],
    });
    this.actionLogForm.controls['toDate'].disable();
    this.genericDataSource = new MatTableDataSource<any>(Generic_data_source);
  }

  ngAfterViewInit(): void {
    this.specificDataSource.paginator = this.paginator;
    this.specificDataSource.sort = this.sort;

    this.genericDataSource.paginator = this.paginator;
    this.genericDataSource.sort = this.sort;

    this.genericDataSource.sortingDataAccessor = (data, sortHeaderId) =>
      data[sortHeaderId];
  }

  parseDateString(dateStr: string | Date | null): Date | null {
    if (dateStr instanceof Date) {
      return dateStr;
    }
    if (!dateStr) return null;

    // Match "MM-dd-yyyy" format
    const mmddyyyy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (mmddyyyy) {
      return new Date(
        Number(mmddyyyy[3]),
        Number(mmddyyyy[1]) - 1,
        Number(mmddyyyy[2])
      );
    }

    // Match "DD-MM-YYYY" format
    const ddmmyyyy = dateStr.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddmmyyyy) {
      return new Date(
        Number(ddmmyyyy[3]), // Year
        Number(ddmmyyyy[2]) - 1, // Month (0-based)
        Number(ddmmyyyy[1]) // Day
      );
    }

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  tabChange(event: any) {
    let selectedLabel = event.tab.textLabel;
    this.activeTab = selectedLabel;

    this.actionLogForm.controls['fromDate'].setValue(null);
    this.actionLogForm.controls['toDate'].setValue(null);
    this.actionLogForm.controls['responsible'].setValue(0);
    this.actionLogForm.controls['actionStatus'].setValue(0);
    this.actionLogForm.controls['toDate'].disable();
  }

  filterData() {
    this.specificDataSource.filter = '';
    this.genericDataSource.filter = '';

    // Get the filter values
    const fromDateStr = this.actionLogForm.controls['fromDate'].value;
    const toDateStr = this.actionLogForm.controls['toDate'].value;
    const responsible = this.actionLogForm.controls['responsible'].value;
    const actionStatus = this.actionLogForm.controls['actionStatus'].value;

    // Parse the date strings
    const fromDate = this.parseDateString(fromDateStr);
    const toDate = this.parseDateString(toDateStr);

    let specificData = [...this.specificDataSource.data];
    let genericData = [...this.genericDataSource.data];

    // Filter the data
    let filteredData =
      this.activeTab == 'Specific Action' ? specificData : genericData;

    if (fromDate && toDate) {
      filteredData = filteredData.filter((f) => {
        const rawDate = this.parseDateString(f.actionDate);
        return rawDate && rawDate >= fromDate && rawDate <= toDate;
      });
    }

    if (responsible) {
      filteredData = filteredData.filter((f) => f.responsible === responsible);
    }

    if (actionStatus) {
      filteredData = filteredData.filter((f) => f.status === actionStatus);
    }

    //**Update the DataSource */
    if (this.activeTab == 'Specific Action') {
      this.specificDataSource = new MatTableDataSource(filteredData);
      if (this.paginator) {
        this.paginator.pageIndex = 0;
        this.specificDataSource.paginator = this.paginator;
        this.specificDataSource.sort = this.sort;
        // this.specificDataSource.paginator = this.paginator ?? null;
      }
    } else {
      this.genericDataSource = new MatTableDataSource(filteredData);
      if (this.paginator) {
        this.paginator.pageIndex = 0;
        // this.specificDataSource.paginator = this.paginator;
        this.genericDataSource.paginator = this.paginator ?? null;
        this.genericDataSource.sort = this.sort;
        // this.specificDataSource.paginator = this.paginator ?? null;
      }
    }
  }

  clearFilters(): void {
    this.specificDataSource = new MatTableDataSource<any>(Specific_data_source);
    this.genericDataSource = new MatTableDataSource<any>(Generic_data_source);

    this.specificDataSource.paginator = this.paginator;
    this.genericDataSource.paginator = this.paginator;

    //** if particular field should reset the use */

    // this.actionLogForm.controls['fromDate'].setValue(null);
    // this.actionLogForm.controls['toDate'].setValue(null);
    // this.actionLogForm.controls['responsible'].setValue(0);
    // this.actionLogForm.controls['actionStatus'].setValue(0);

    this.actionLogForm.controls['toDate'].disable();
    this.table.renderRows();
    this.actionLogForm.reset(); // Reset entire Fields
  }

  doFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.specificDataSource.filter = filterValue;
    this.genericDataSource.filter = filterValue;
  }

  updateMinToDate(selectedFromDate: Date): void {
    this.minToDate = selectedFromDate;
    this.actionLogForm.controls['toDate'].setValue(null);
    this.actionLogForm.controls['toDate'].enable();
  }

  deleteElementFromArray(array: any[], salesId: string): void {
    if (this.activeTab == 'Specific Action') {
      const index = array.findIndex((element) => element.salesId === salesId);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
    if (this.activeTab == 'Generic Action') {
      const index = array.findIndex((element) => element.slNo === salesId);
      if (index !== -1) {
        array.splice(index, 1);
      }
    }
  }

  deleteItem(row: any, event: any): void {
    try {
      event.stopPropagation();
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '30%',
        data: {
          title: 'Confirm Action',
          message: 'Are you sure you want to delete?',
        },
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result === true) {
            // Delete the element from the array
            if (this.activeTab == 'Specific Action') {
              this.deleteElementFromArray(Specific_data_source, row.salesId);
              this.specificDataSource = new MatTableDataSource<SalesData>(
                Specific_data_source
              );
            } else {
              if (this.activeTab == 'Generic Action') {
                this.deleteElementFromArray(Generic_data_source, row.slNo);
                this.genericDataSource = new MatTableDataSource<GenericData>(
                  Generic_data_source
                );
              }
            }

            // Update the data source
            if (this.activeTab == 'Specific Action') {
              this.specificDataSource.paginator = this.paginator ?? null;
              this.specificDataSource.sort = this.sort;
            } else {
              this.genericDataSource.paginator = this.paginator ?? null;
              this.genericDataSource.sort = this.sort;
            }

            if (this.paginator) {
              this.paginator.pageIndex = 0;
              if (this.activeTab == 'Specific Action') {
                this.specificDataSource.paginator = this.paginator;
                this.specificDataSource.sort = this.sort;
              } else {
                this.genericDataSource.paginator = this.paginator;
                this.genericDataSource.sort = this.sort;
              }
            }
          }
        },
        error: (error) => {
          this.toastr.error('Error in delete operation', error);
        },
      });
    } catch (error) {
      this.toastr.error('Error processing delete request', error);
    }
  }

  //** Add Dialog Modal */
  AddNewAction(event: Event) {
    event.preventDefault();

    try {
      event.stopPropagation(); // Prevent event from bubbling up to parent elements

      const dialogRef = this.dialog.open(AddEditGenericActionComponent, {
        width: '75%',
        data: {
          title: 'Add Generic Action', // Title for the dialog
          button: 'Save', // Text for the save button
        },
        disableClose: true, // Prevent closing the dialog by clicking outside
      });

      // Handle the dialog's close event
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
        }
      });
    } catch (error) {
      console.error('Error in addCapacity:', error); // Log any errors in adding capacity
    }
  }

  editDialog(event: any, rowData: any) {
    event.stopPropagation();
    event.preventDefault();

    const dialogRef = this.dialog.open(AddEditGenericActionComponent, {
      width: '75%',
      data: {
        title: 'Edit Generic Action', // Title for the dialog
        button: 'Update', // Text for the save button
        value: rowData,
      },
      disableClose: true, // Prevent closing the dialog by clicking outside
    });

    // Handle the dialog's close event
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
}
