import { TestBed } from '@angular/core/testing';

import { AiChatbotInterfaceService } from './ai-chatbot-interface.service';

describe('AiChatbotInterfaceService', () => {
  let service: AiChatbotInterfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiChatbotInterfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
