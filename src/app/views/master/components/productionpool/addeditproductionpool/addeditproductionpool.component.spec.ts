import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditproductionpoolComponent } from './addeditproductionpool.component';

describe('AddeditproductionpoolComponent', () => {
  let component: AddeditproductionpoolComponent;
  let fixture: ComponentFixture<AddeditproductionpoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditproductionpoolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditproductionpoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
