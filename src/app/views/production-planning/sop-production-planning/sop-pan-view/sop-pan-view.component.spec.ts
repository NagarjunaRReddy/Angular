import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopPanViewComponent } from './sop-pan-view.component';

describe('SopPanViewComponent', () => {
  let component: SopPanViewComponent;
  let fixture: ComponentFixture<SopPanViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopPanViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopPanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
