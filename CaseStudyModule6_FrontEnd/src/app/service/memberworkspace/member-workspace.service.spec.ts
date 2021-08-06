import { TestBed } from '@angular/core/testing';

import { MemberWorkspaceService } from './member-workspace.service';

describe('MemberWorkspaceService', () => {
  let service: MemberWorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberWorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
