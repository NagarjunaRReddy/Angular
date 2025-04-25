import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingstatusComponent } from './drawingstatus.component';

describe('DrawingstatusComponent', () => {
  let component: DrawingstatusComponent;
  let fixture: ComponentFixture<DrawingstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawingstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawingstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
