import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoStatusComponent } from './co-status.component';

describe('CoStatusComponent', () => {
  let component: CoStatusComponent;
  let fixture: ComponentFixture<CoStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
