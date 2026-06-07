import { Injectable } from '@angular/core';
import { AI_RAG_CHATBOT_URL } from '../../Common_Configuration/Constant/urls';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  time: string;
}

@Injectable({
  providedIn: 'root'
})

export class AiChatbotInterfaceService {

  constructor(private http:HttpClient) { }
  sendQuestion_to_Backend(Question_from_user: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(AI_RAG_CHATBOT_URL, Question_from_user, { withCredentials: true }); 
  };
}
