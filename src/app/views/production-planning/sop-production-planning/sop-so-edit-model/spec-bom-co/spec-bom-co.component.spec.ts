import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecBomCoComponent } from './spec-bom-co.component';

describe('SpecBomCoComponent', () => {
  let component: SpecBomCoComponent;
  let fixture: ComponentFixture<SpecBomCoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecBomCoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecBomCoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
