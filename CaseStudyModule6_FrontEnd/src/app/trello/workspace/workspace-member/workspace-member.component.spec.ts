import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMemberComponent } from './workspace-member.component';

describe('WorkspaceMemberComponent', () => {
  let component: WorkspaceMemberComponent;
  let fixture: ComponentFixture<WorkspaceMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkspaceMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
