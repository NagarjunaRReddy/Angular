import { Component } from '@angular/core';
import { HelperService } from '../../../../services/helper.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
 activeData: string = 'Item Status';

  masterMenus: any = [
    {
      name: 'Item Status',
      route: 'inventory-status',
      title: 'Item Status',
    },
    {
      name: 'On Hand',
     route: 'inventory-onhand',
      title: 'On Hand',
    },
    {
      name: 'Purchase Order',
      route: 'inventory-purchaseorder',
      title: 'Purchase Order',
    }
  ];
  

  constructor(
    private formBuilder: FormBuilder,
    private helper: HelperService,
   
    private router:Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.activeData = this.masterMenus.find(menu => this.router.url.includes(menu.route))?.name || '';
    });
  }


  setActiveStatus(data: any) {    
    this.activeData = data.name;
    this.router.navigate([data.route], { relativeTo: this.route });
  }
}

