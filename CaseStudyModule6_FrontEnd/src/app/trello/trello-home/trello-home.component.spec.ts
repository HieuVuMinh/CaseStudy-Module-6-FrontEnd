import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloHomeComponent } from './trello-home.component';

describe('TrelloHomeComponent', () => {
  let component: TrelloHomeComponent;
  let fixture: ComponentFixture<TrelloHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrelloHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
