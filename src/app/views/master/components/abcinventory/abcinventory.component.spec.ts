import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcinventoryComponent } from './abcinventory.component';

describe('AbcinventoryComponent', () => {
  let component: AbcinventoryComponent;
  let fixture: ComponentFixture<AbcinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbcinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbcinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
