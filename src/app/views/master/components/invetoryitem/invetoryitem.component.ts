import { Component, OnInit } from '@angular/core';
import { InventoryItemService } from '../../../production-planning/services/inventory-item.service';
import { HelperService } from '../../../../services/helper.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MasterdetailsService } from '../../../../services/masterdetails.service';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryItemStatusSelectEntity } from '../../../../interfaces/inventoryitemstatus';
import { MasterDetailsEntity } from '../../../../interfaces/master-details-entity';
import { EditinventoryitemComponent } from './editinventoryitem/editinventoryitem.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invetoryitem',
  templateUrl: './invetoryitem.component.html',
  styleUrl: './invetoryitem.component.scss'
})
export class InvetoryitemComponent implements OnInit
{
menuAccess: any;
  subMenuAccess: any;

  

addDrgstatus($event: MouseEvent) {
throw new Error('Method not implemented.');
}

  displayedColumns: any[] = [];
    loadTable: boolean = false;
    loginInfo: any;
    allSBusinessMaster: any;
    columnNames: any[] = [];
    public dataSource = new MatTableDataSource<any>()
    subscribedService: any[] = [];
    menuData: any;
    inventorystatus!: FormGroup;
  
    settings = {
      "TableSettingsId": 3,
      "RoleId": 6,
      "IsScrollable": false,
      "IsPagination": true,
      "IsSorting": true,
      "IsFilter": true,
      "IsMultiselect": false,
      "Pagination": true,
      "TenantId": 1,
      "CreatedBy": 1,
      "CreatedOn": "2024-12-01T06:56:53.797",
      "ModifiedBy": null,
      "ModifiedOn": null
    };
  
  
    constructor(
      private inventoryitemservice: InventoryItemService,
      private helperService: HelperService,
      private fb: FormBuilder,
      private dialog: MatDialog,
      private toster: ToastrService,
      private masterdetailsService: MasterdetailsService,
      private router: Router
    ) { }


    Getinventoryitemstatus() {
       {
         const inventoryitemstatus: InventoryItemStatusSelectEntity = {
          InventoryItemId: 0,//JSON.parse(this.helperService.getUserBusinessId()),//this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
          TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0,
         };
         const businessService = this.inventoryitemservice.getInventoryData(inventoryitemstatus).subscribe(
           (res: any) => {
            console.log(res,'respo');
             if (res && res.length && !res[0]?.Message) {
               this.allSBusinessMaster = res;
               //this.columnNames = ['DrawingStatus', 'Color', 'Action'] //here add what columns you want 
   
                const mappedData = res.map((item: any) => {
                  const row: any = {};
                  this.columnNames.forEach((col, index) => {
                    row[col] = item[col] || ''; // Handle missing values
   
                  });
                  return row;
                });
               this.dataSource.data = res;
               console.log(res,'respo');
              // console.log(this.dataSource.data);
   
               this.loadTable = true;
             }
           },
           (error) => {
             console.error("Some error occurred", error);
           }
         );
         this.subscribedService.push(businessService);
       }
     }
   


  ngOnInit(): void {
    this.inventorystatus = this.fb.group({
      searchTab: ['']
    })
    this.loginInfo = JSON.parse(this.helperService.getValue('LoginInfo') || '{}'); //this is same for all
    this.menuData = JSON.parse(this.helperService.getValue('leftMenu') || '{}');//this is same for all
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
  getColumns(): void
    {
      const masterDetailsEntity: MasterDetailsEntity = 
    {
        MasterName: 'Drawing Status Master',
        TenantId: this.loginInfo.TenantId ? this.loginInfo.TenantId : 0, //1 // Assuming static value or retrieve from loginInfo.TenantId
    };
  
      const drawingStatus = this.masterdetailsService
        .getMasterDetailsByName(masterDetailsEntity)
        .subscribe(
          (res: any) => {
            if (!res[0]?.Message) {
              //this.displayedColumns = res.map((item: any) => item.DisplayName);
              //this.displayedColumns = res.map((itm => itm.DisplayName))----Bacckend
  
              //this.columnNames = res.map((item: any) => item.ColumnName);------Bacckend Data(responce)
              this.columnNames = res.map(((item) => item.ColumnName));
              
              
  
              this.columnNames = ['InventoryItemNumber', 'InventoryItemName', 'ReferenceItemName','FlagItem']
              this.columnNames.unshift('Sl.No');
              this.columnNames.push('Action');
               //here add what columns you want 
              console.log(this.columnNames);
             // console.log(res)
  
  
              // Include a "select" column if multiselect is enabled
              if (this.settings.IsMultiselect) {
                this.displayedColumns.unshift('select');
              }
              // Fetch data only after initializing columns
              this.Getinventoryitemstatus();
            }
          },
          (error: any) => {
            //console.error('Error fetching master details:', error);
            this.toster.error(error);
          }
        );
      this.subscribedService.push(drawingStatus);
    }



     editItem(row: any, event: Event) {
        console.log(row);
        try {
          event.stopPropagation();
          const dialogRef = this.dialog.open(EditinventoryitemComponent, {
            width: '35%',
            data: {
              title: 'Update Item Master',
              button: 'Update',
              view: false,
              value: row
            },
            disableClose: true
          });
          this.Getinventoryitemstatus();
    
          dialogRef.afterClosed().toPromise()
            .then((result) => {
              if (result === true) {
                this.Getinventoryitemstatus();
              }
            })
            .catch(error => {
              console.error('Dialog error:', error);
              this.toster.error('Error updating business unit', 'ERROR');
            });
        }
        catch (error) {
          console.error('Error in editBusiness:', error);
          this.toster.error('Error opening edit dialog', 'ERROR');
        }
      }

      applyFilter(event: Event | string) 
      {
        const filterValue = typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
}
