import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloViewComponent } from './trello-view.component';

describe('TrelloViewComponent', () => {
  let component: TrelloViewComponent;
  let fixture: ComponentFixture<TrelloViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrelloViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
