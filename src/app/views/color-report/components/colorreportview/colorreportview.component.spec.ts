import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorreportviewComponent } from './colorreportview.component';

describe('ColorreportviewComponent', () => {
  let component: ColorreportviewComponent;
  let fixture: ComponentFixture<ColorreportviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorreportviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorreportviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
