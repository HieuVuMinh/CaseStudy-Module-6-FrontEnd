import { TestBed } from '@angular/core/testing';

import { CommentCardService } from './comment-card.service';

describe('CommentCardService', () => {
  let service: CommentCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
