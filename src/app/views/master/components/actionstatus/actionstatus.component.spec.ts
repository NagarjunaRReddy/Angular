import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionstatusComponent } from './actionstatus.component';

describe('ActionstatusComponent', () => {
  let component: ActionstatusComponent;
  let fixture: ComponentFixture<ActionstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActionstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
