import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorypurchaseorderComponent } from './inventorypurchaseorder.component';

describe('InventorypurchaseorderComponent', () => {
  let component: InventorypurchaseorderComponent;
  let fixture: ComponentFixture<InventorypurchaseorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventorypurchaseorderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorypurchaseorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
