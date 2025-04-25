import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-nav-menu',
  templateUrl: './top-nav-menu.component.html',
  styleUrl: './top-nav-menu.component.scss'
})
export class TopNavMenuComponent implements OnInit {

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  logout(){
    
  }

}
