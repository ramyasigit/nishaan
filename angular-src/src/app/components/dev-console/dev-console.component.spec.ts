import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevConsoleComponent } from './dev-console.component';

describe('DevConsoleComponent', () => {
  let component: DevConsoleComponent;
  let fixture: ComponentFixture<DevConsoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevConsoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
