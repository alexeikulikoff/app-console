import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeCheckerComponent } from './tree-checker.component';

describe('TreeCheckerComponent', () => {
  let component: TreeCheckerComponent;
  let fixture: ComponentFixture<TreeCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeCheckerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
