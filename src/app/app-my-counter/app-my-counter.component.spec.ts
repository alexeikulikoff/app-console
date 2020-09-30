import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMyCounterComponent } from './app-my-counter.component';

describe('AppMyCounterComponent', () => {
  let component: AppMyCounterComponent;
  let fixture: ComponentFixture<AppMyCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppMyCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMyCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
