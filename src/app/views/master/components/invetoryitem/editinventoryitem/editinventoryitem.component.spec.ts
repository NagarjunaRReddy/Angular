import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditinventoryitemComponent } from './editinventoryitem.component';

describe('EditinventoryitemComponent', () => {
  let component: EditinventoryitemComponent;
  let fixture: ComponentFixture<EditinventoryitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditinventoryitemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditinventoryitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
