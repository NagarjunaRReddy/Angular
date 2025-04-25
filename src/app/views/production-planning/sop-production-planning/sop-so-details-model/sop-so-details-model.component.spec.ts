import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopSoDetailsModelComponent } from './sop-so-details-model.component';

describe('SopSoDetailsModelComponent', () => {
  let component: SopSoDetailsModelComponent;
  let fixture: ComponentFixture<SopSoDetailsModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopSoDetailsModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopSoDetailsModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
