import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrdStageComponent } from './prd-stage.component';

describe('PrdStageComponent', () => {
  let component: PrdStageComponent;
  let fixture: ComponentFixture<PrdStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrdStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrdStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
