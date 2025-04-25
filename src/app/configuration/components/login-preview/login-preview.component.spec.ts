import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPreviewComponent } from './login-preview.component';

describe('LoginPreviewComponent', () => {
  let component: LoginPreviewComponent;
  let fixture: ComponentFixture<LoginPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
