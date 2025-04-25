import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacityAreaComponent } from './capacity-area.component';

describe('CapacityAreaComponent', () => {
  let component: CapacityAreaComponent;
  let fixture: ComponentFixture<CapacityAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapacityAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacityAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
