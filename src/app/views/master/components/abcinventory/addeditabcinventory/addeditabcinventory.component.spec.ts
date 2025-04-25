import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditabcinventoryComponent } from './addeditabcinventory.component';

describe('AddeditabcinventoryComponent', () => {
  let component: AddeditabcinventoryComponent;
  let fixture: ComponentFixture<AddeditabcinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditabcinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditabcinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
