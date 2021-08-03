import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarBoardHeaderComponent } from './navbar-board-header.component';

describe('NavbarBoardHeaderComponent', () => {
  let component: NavbarBoardHeaderComponent;
  let fixture: ComponentFixture<NavbarBoardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarBoardHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarBoardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
