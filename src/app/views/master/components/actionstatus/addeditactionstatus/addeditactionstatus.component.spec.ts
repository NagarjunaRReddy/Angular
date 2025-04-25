import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditactionstatusComponent } from './addeditactionstatus.component';

describe('AddeditactionstatusComponent', () => {
  let component: AddeditactionstatusComponent;
  let fixture: ComponentFixture<AddeditactionstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditactionstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditactionstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
