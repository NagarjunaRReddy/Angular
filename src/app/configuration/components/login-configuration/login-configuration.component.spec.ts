import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginConfigurationComponent } from './login-configuration.component';

describe('LoginConfigurationComponent', () => {
  let component: LoginConfigurationComponent;
  let fixture: ComponentFixture<LoginConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginConfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
