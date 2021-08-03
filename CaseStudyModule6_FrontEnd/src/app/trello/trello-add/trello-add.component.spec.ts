import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloAddComponent } from './trello-add.component';

describe('TrelloAddComponent', () => {
  let component: TrelloAddComponent;
  let fixture: ComponentFixture<TrelloAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrelloAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrelloAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
