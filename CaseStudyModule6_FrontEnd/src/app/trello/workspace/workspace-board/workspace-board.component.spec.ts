import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceBoardComponent } from './workspace-board.component';

describe('WorkspaceBoardComponent', () => {
  let component: WorkspaceBoardComponent;
  let fixture: ComponentFixture<WorkspaceBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
