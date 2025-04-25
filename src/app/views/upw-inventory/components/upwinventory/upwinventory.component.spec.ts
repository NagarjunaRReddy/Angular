import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpwinventoryComponent } from './upwinventory.component';

describe('UpwinventoryComponent', () => {
  let component: UpwinventoryComponent;
  let fixture: ComponentFixture<UpwinventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpwinventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpwinventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
