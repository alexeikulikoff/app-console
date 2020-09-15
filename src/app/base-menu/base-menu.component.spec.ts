import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMenuComponent } from './base-menu.component';

describe('BaseMenuComponent', () => {
  let component: BaseMenuComponent;
  let fixture: ComponentFixture<BaseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
