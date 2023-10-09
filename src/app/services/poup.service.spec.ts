import { TestBed } from '@angular/core/testing';

import { PoupService } from './poup.service';

describe('PoupService', () => {
  let service: PoupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
