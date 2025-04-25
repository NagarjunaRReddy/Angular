import { Directive, Inject, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
 
@Directive({
  selector: '[appGenericDate]',
})
export class GenericDateDirective implements OnInit {
  constructor(@Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats) {}
 
  ngOnInit(): void {
    this.dateFormats.parse.dateInput = 'MM-DD-YYYY';
    this.dateFormats.display.dateInput = 'MM-DD-YYYY';
  }
}
 