import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionstatusComponent } from './productionstatus.component';

describe('ProductionstatusComponent', () => {
  let component: ProductionstatusComponent;
  let fixture: ComponentFixture<ProductionstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
