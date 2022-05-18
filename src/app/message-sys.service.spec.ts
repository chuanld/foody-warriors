import { TestBed } from '@angular/core/testing';

import { MessageSysService } from './message-sys.service';

describe('MessageSysService', () => {
  let service: MessageSysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageSysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
