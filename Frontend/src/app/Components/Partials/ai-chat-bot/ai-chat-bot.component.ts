import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AiChatbotInterfaceService } from '../../../Services/AI_Chatbot/ai-chatbot-interface.service';

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
export class AIChatBotComponent {
  private readonly panelStateStorageKey = 'nen-thom-ai-chatbot-open';

  isOpen = false;
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
      id: this.createId(),
      role: 'assistant',
      content: 'Xin chao, minh la tro ly AI cua Nen Thom. Ban can goi y san pham hay ho tro don hang?',
      time: this.nowTime()
    }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object , 
    private ai_chatbot_interface_service: AiChatbotInterfaceService
  ) {
    this.isOpen = this.getStoredPanelState();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;
    this.persistPanelState();
  }

  GLOBAL_Resonse_message : ChatMessage = {
    id: '',
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
      id: this.createId(),
      role: 'user',
      content: message,
      time: this.nowTime()
    }

    this.messages.push(current_message); // Add user message to the chat history

    this.draftMessage = '';

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

  private nowTime(): string {
    return new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
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

}
