import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopSoEditModelComponent } from './sop-so-edit-model.component';

describe('SopSoEditModelComponent', () => {
  let component: SopSoEditModelComponent;
  let fixture: ComponentFixture<SopSoEditModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SopSoEditModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SopSoEditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
