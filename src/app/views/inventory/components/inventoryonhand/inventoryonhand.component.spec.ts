import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryonhandComponent } from './inventoryonhand.component';

describe('InventoryonhandComponent', () => {
  let component: InventoryonhandComponent;
  let fixture: ComponentFixture<InventoryonhandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventoryonhandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryonhandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
