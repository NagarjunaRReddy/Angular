import { Component, OnInit } from '@angular/core';
import { LogoService } from '../../../services/logo.service';
import { HelperService } from '../../../services/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss',
})
export class SideNavComponent implements OnInit {
  logoUrl: string = '';
  menuData: any[] = [];

  constructor(
    private logoService: LogoService,
    private helper: HelperService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.logoService.logoUrl$.subscribe((url) => {
      this.logoUrl = url;
    });
    this.menuData = JSON.parse(this.helper.getValue('leftMenu') || '[]'); //this is same for all
    console.log(this.menuData);
  }

  ngDoCheck(): void {
    // Optionally, check for changes in the logo URL in each change detection cycle
    this.logoUrl = this.logoService.getLogoUrl();
  }

  getIconName(menu_name: string): string {
    switch (menu_name.trim()) {
      case 'Production Planning':
        return 'fa fa-truck-fast';

      case 'Action Log':
        return 'fa fa-clipboard-list';

      case 'Masters':
        return 'fa fa-layer-group';

      case 'Configuration':
        return 'fa fa-gears';

      case 'Reports':
        return 'fa fa-file-lines';

      case 'Color Report':
        return 'fa fa-palette';

      case 'Sales Order':
        return 'fa fa-house-chimney-window';

      case 'Big Parts':
        return 'fa-solid fa-expand';

      case 'Inventory':
        return 'fa fa-cubes-stacked';

      case 'Capacity Planing':
        return 'fa fa-bolt';

      case 'User Management':
        return 'fa fa-users-viewfinder';
        
        case 'Upw Inventory':
        return 'fa fa-users-viewfinder';

      default:
        return '';
    }
  }

  logout() {
    this.helper.clearStorage();
    this.router.navigateByUrl('');
  }
}
