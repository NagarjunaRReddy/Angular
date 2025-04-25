import { Directive, Inject, Input, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

@Directive({
  selector: '[appMonthPicker]',
})
export class MonthPickerDirective implements OnInit {
  @Input() date!: string;
  constructor(@Inject(MAT_DATE_FORMATS) private dateFormats: MatDateFormats) {}

  ngOnInit(): void {
    this.dateFormats.parse.dateInput = 'MM-yyyy';
    this.dateFormats.display.dateInput = 'MM-yyyy';
  }
}
