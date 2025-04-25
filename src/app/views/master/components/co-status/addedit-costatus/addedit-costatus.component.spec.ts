import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditCostatusComponent } from './addedit-costatus.component';

describe('AddeditCostatusComponent', () => {
  let component: AddeditCostatusComponent;
  let fixture: ComponentFixture<AddeditCostatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddeditCostatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddeditCostatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
