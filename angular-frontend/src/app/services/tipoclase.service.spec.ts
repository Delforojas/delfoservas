import { TestBed } from '@angular/core/testing';

import { Tipoclase } from '../shared/services/tipoclase.service';

describe('Tipoclase', () => {
  let service: Tipoclase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tipoclase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
