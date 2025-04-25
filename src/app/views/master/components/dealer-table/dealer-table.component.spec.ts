import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerTableComponent } from './dealer-table.component';

describe('DealerTableComponent', () => {
  let component: DealerTableComponent;
  let fixture: ComponentFixture<DealerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealerTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
