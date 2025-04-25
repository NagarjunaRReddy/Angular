import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorReportComponent } from './color-report.component';

describe('ColorReportComponent', () => {
  let component: ColorReportComponent;
  let fixture: ComponentFixture<ColorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
