import { Component } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss'
})
export class ConfigurationComponent {
  activeMenu:boolean = false;

  changeView(event: any) {
    const isChecked = event.target.checked; // This will be true or false
    console.log(isChecked); // Outputs true if checked, false if unchecked
    this.activeMenu = isChecked;
  }
  

}
