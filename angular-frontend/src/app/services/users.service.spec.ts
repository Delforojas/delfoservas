import { TestBed } from '@angular/core/testing';

import { Users } from '../shared/services/users.service';

describe('Users', () => {
  let service: Users;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Users);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
