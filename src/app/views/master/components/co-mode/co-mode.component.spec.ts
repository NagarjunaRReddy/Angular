import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoModeComponent } from './co-mode.component';

describe('CoModeComponent', () => {
  let component: CoModeComponent;
  let fixture: ComponentFixture<CoModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
