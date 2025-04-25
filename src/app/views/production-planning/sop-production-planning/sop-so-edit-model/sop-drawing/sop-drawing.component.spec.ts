import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopDrawingComponent } from './sop-drawing.component';

describe('SopDrawingComponent', () => {
  let component: SopDrawingComponent;
  let fixture: ComponentFixture<SopDrawingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopDrawingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
