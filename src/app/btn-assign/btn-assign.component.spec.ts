import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnAssignComponent } from './btn-assign.component';

describe('BtnAssignComponent', () => {
  let component: BtnAssignComponent;
  let fixture: ComponentFixture<BtnAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtnAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
