import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferedMenuComponent } from './prefered-menu.component';

describe('PreferedMenuComponent', () => {
  let component: PreferedMenuComponent;
  let fixture: ComponentFixture<PreferedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreferedMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
