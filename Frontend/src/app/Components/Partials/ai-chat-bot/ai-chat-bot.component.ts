import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, Inject, PLATFORM_ID, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AiChatbotInterfaceService } from '../../../Services/AI_Chatbot/ai-chatbot-interface.service';
import { marked } from 'marked';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  time: string;
}

interface ChatQuickAction {
  id: string;
  label: string;
  value: string;
}

interface ChatBotProfile {
  name: string;
  subtitle: string;
  online: boolean;
}

@Component({
  selector: 'app-ai-chat-bot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-chat-bot.component.html',
  styleUrl: './ai-chat-bot.component.css'
})
export class AIChatBotComponent implements AfterViewChecked {
  private readonly panelStateStorageKey = 'nen-thom-ai-chatbot-open';
  private ssidForNonBrowser?: string;
  private shouldScrollToBottom = false;

  @ViewChild('chatMessages')
  private chatMessages?: ElementRef<HTMLDivElement>;

  isOpen = false;
  isThinking = false;
  draftMessage = '';

  readonly profile: ChatBotProfile = {
    name: 'Nen Thom Assistant',
    subtitle: 'Tu van nhanh ve nen thom, don hang va uu dai',
    online: true
  };

  readonly quickActions: ChatQuickAction[] = [
    { id: '1', label: 'Nen moi ve', value: 'Cho minh xem cac mau nen moi ve tuan nay.' },
    { id: '2', label: 'Kiem tra don', value: 'Toi muon kiem tra tinh trang don hang cua toi.' },
    { id: '3', label: 'Tu van mui huong', value: 'Goi y giup toi 3 mui huong thu gian de dung buoi toi.' }
  ];

  messages: ChatMessage[] = [
    {
      id: this.Check_and_provide_SSID(),
      role: 'assistant',
      content: 'Xin chao, minh la tro ly AI cua Nen Thom. Ban can goi y san pham hay ho tro don hang?',
      time: this.nowTime()
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object , 
    private ai_chatbot_interface_service: AiChatbotInterfaceService,
    private sanitizer: DomSanitizer
  ) {
    this.isOpen = this.getStoredPanelState();
    if (this.isOpen) {
      this.requestScrollToBottom();
    }
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    this.persistPanelState();

    if (this.isOpen) {
      this.requestScrollToBottom();
    }
  }

  Check_and_provide_SSID() : string {
    const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

    if (storage) {
      const existing_ssid = storage.getItem('SSID_for_AI_chatbot');
      if (existing_ssid) {
        return existing_ssid;
      }

      const new_ssid = this.createId();
      storage.setItem('SSID_for_AI_chatbot', new_ssid);
      return new_ssid;
    }

    // Keep a stable ID during SSR where localStorage is unavailable.
    if (!this.ssidForNonBrowser) {
      this.ssidForNonBrowser = this.createId();
    }

    return this.ssidForNonBrowser;
  }

  GLOBAL_Resonse_message : ChatMessage = {
    id: this.Check_and_provide_SSID(),
    role: 'assistant',
    content: '',
    time: ''
  };
  
  async InteractWithAIChatbot(question: ChatMessage): Promise<ChatMessage>{
      // Sau này sẽ gọi API lấy dữ liệu customer
      // Hiện tại dùng dữ liệu mẫu
      return new Promise<ChatMessage>((resolve) => {
        this.ai_chatbot_interface_service.sendQuestion_to_Backend(question).subscribe(data => {
          this.GLOBAL_Resonse_message = data;
          console.log("Response from AI chatbot raw data:", data); // Log the response for debugging
          console.log("Response from AI chatbot raw data:", data.content); // Log the response for debugging
          resolve(data);
        });
      });
      // console.log("Response from AI chatbot:", this.GLOBAL_Resonse_message); // Log the response for debugging
      // return this.GLOBAL_Resonse_message;
    }
  async sendMessage(): Promise<void> {
    const message = this.draftMessage.trim();
    console.log("Draft message before sending:", this.draftMessage); // Log the draft message for debugging
    console.log("User message:", message); // Log the user message for debugging
    if (!message) {
      return;
    }
    const current_message: ChatMessage = {
      id: this.Check_and_provide_SSID(),
      role: 'user',
      content: message,
      time: this.nowTime()
    }

    this.messages.push(current_message); // Add user message to the chat history
    this.requestScrollToBottom();

    this.draftMessage = '';
    this.isThinking = true;
    this.requestScrollToBottom();

    try {
      // Call the function to interact with the AI chatbot using the user's message and assign to response_message variable
      const response_message: ChatMessage = await this.InteractWithAIChatbot(current_message);

      // Placeholder response to keep the UI feeling alive before API integration.
      // this.messages.push({
      //   id: this.createId(),
      //   role: 'assistant',
      //   content: 'Minh da nhan yeu cau cua ban. Ban co the noi ro hon de minh goi y chinh xac hon nhe.',
      //   time: this.nowTime()
      // });

      this.messages.push(response_message); // Add AI response to the chat history
      this.requestScrollToBottom();
    } catch {
      this.messages.push({
        id: this.Check_and_provide_SSID(),
        role: 'assistant',
        content: 'Xin loi, he thong dang ban. Ban thu lai sau it phut nhe.',
        time: this.nowTime()
      });
      this.requestScrollToBottom();
    } finally {
      this.isThinking = false;
    }
  }

  useQuickAction(action: ChatQuickAction): void {
    this.draftMessage = action.value;
    this.sendMessage();
  }

  trackByMessage(_: number, item: ChatMessage): string {
    return item.id;
  }

  trackByAction(_: number, item: ChatQuickAction): string {
    return item.id;
  }

  // Function to convert markdown content to sanitized HTML
  provideMarkdown(content: string): string {
    const normalizedContent = (content ?? '').replace(/\\n/g, '\n').trim();
    const rawHtml = marked.parse(normalizedContent, { breaks: true });
    return this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
  }

  private nowTime(): string {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  private createId(): string {
    return Math.random().toString(36).slice(2, 11);
  }

  private getStoredPanelState(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return localStorage.getItem(this.panelStateStorageKey) === 'true';
  }

  private persistPanelState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.panelStateStorageKey, String(this.isOpen));
  }

  ngAfterViewChecked(): void {
    if (!this.shouldScrollToBottom) {
      return;
    }

    this.scrollToBottom();
    this.shouldScrollToBottom = false;
  }

  private requestScrollToBottom(): void {
    this.shouldScrollToBottom = true;
  }

  private scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId) || !this.chatMessages) {
      return;
    }

    const container = this.chatMessages.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

}
