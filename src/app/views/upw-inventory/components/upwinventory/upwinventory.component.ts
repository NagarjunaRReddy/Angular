import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HelperService } from '../../../../services/helper.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-upwinventory',
  templateUrl: './upwinventory.component.html',
  styleUrl: './upwinventory.component.scss'
})
export class UpwinventoryComponent {
activeData: string = 'Item Status';

  masterMenus: any = [
    {
      name: 'Demand',
      route: 'demand',
      title: 'Demand',
    },
    {
      name: 'On Hand',
     route: 'onhand',
      title: 'On Hand',
    },
    {
      name: 'Purchase Order',
      route: 'purchaseorder',
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
