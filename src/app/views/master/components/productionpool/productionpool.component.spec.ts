import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionpoolComponent } from './productionpool.component';

describe('ProductionpoolComponent', () => {
  let component: ProductionpoolComponent;
  let fixture: ComponentFixture<ProductionpoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductionpoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
