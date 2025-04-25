import { Component } from '@angular/core';
import { InvetoryitemComponent } from './components/invetoryitem/invetoryitem.component';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss',
})
export class MasterComponent {
  activeData: string = 'Business Unit';

  masterMenus: any = [
    {
      name: 'Business Unit',
      route: 'business-unit',
      title: 'Business Unit',
    },
    {
      name: 'Site',
      route: 'site-master',
      title: 'Site',
    },
    {
      name: 'Dealer',
      route: 'dealer-table',
      title: 'Dealer ',
    },
    {
      name: 'Truck Status',
      route: 'truck-status',
      title: 'Truck Status',
    },
    {
      name: 'PRD Stage',
      route: 'prd-stage',
      title: 'PRD Stage',
    },
    {
      name: 'Spec Review Status',
      route: 'spec-review-status',
      title: 'Spec Review Status',
    },
    {
      name: 'BOM Status',
      route: 'bom-status',
      title: 'Bom Status',
    },
    {
      name: 'CO Status',
      route: 'co-status',
      title: 'Co Status',
    },
    {
      name: 'Serial Number',
      route: 'serial-number',
      title: 'Serial Number',
    },
    {
      name: 'Production Status',
      route: 'production-status',
      title: 'Production Status',
    },
    {
      name: 'ABC Inventory',
      route: 'abc-inventory',
      title: 'ABC Inventory',
    },
    {
      name: 'Attachment Status',
      route: 'attachment-status',
      title: 'Attachment Status',
    },
    {
      name: 'Action Status',
      route: 'action-status',
      title: 'Action Status',
    },
    {
      name: 'Action Responsible',
      route: 'action-responsible',
      title: 'Action Responsible',
    },
    {
      name: 'Production Pool',
      route: 'production-pool',
      title: 'Production Pool',
    },
    {
      name: 'Drawing Status',
      route: 'drawing-status',
      title: 'Drawing Status',
    },
    {
      name: 'CO Mode',
      route: 'co-mode',
      title: 'Co Mode',
    },
    {
      name: 'Sales Status',
      route: 'sales-status-master',
      title: 'Sales Status',
    },
    {
      name: 'Sales Responsible',
      route: 'sales-resposible',
      title: 'Sales Responsible',
    },
    {
      name: 'Item Master',
      route: 'item-master',
      title: 'Item Master',
    },
    {
      path: 'invetoryitem',
      component: InvetoryitemComponent,
      data: { title: 'Inventory Item' }
    }
  ];
  menuAccess: any[]=[];
  menuData: any[]=[];
  subMenuAccess: any[]=[];

  constructor(private router:Router, private helper:HelperService) {}

  ngOnInit(): void {
    this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '[]');
 
    this.setMenuAccess();
  }

  setMenuAccess() {
    let routerLink = this.router.url;
    this.menuAccess = this.menuData.filter((e: any) =>
      routerLink.includes(e.MenuPath)
    );
    this.subMenuAccess = this.menuAccess[0].children;
    console.log(this.subMenuAccess);
    console.log(routerLink);
    const firstReadableMenuItem = this.subMenuAccess.find(item => item.ReadAccess);
    const firstReadablePath = firstReadableMenuItem ? firstReadableMenuItem.MenuPath : null;
    console.log(firstReadablePath);
    this.router.navigateByUrl('/main/masters/'+firstReadablePath)

  }
}
