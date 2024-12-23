import { makeAutoObservable } from 'mobx';

interface BaseMessage {
  id: string;
  content: string;
  timestamp: Date;
}

interface UserMessage extends BaseMessage {
  type: 'user';
}

interface AssistantMessage extends BaseMessage {
  type: 'assistant';
  status: 'complete' | 'asking-information' | 'executing-tool';
}

type Message = UserMessage | AssistantMessage;

class MessageStore {
  messages: Message[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addUserMessage(content: string) {
    const message: UserMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type: 'user'
    };
    this.messages.push(message);
  }

  

  addAssistantMessage(content: string) {
    const message: AssistantMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type: 'assistant',
      status: 'complete'
    };
    this.messages.push(message);
  }

  updateAssistantMessage(id: string, content: string) {
    const message = this.messages.find(msg => msg.id === id && msg.type === 'assistant');
    if (message && message.type === 'assistant') {
      message.content = content;
      message.status = 'complete';
    }
  }

  get userMessages() {
    return this.messages.filter((msg): msg is UserMessage => msg.type === 'user');
  }

  get assistantMessages() {
    return this.messages.filter((msg): msg is AssistantMessage => msg.type === 'assistant');
  }

  get latestMessage() {
    return this.messages[this.messages.length - 1];
  }

  get messagesForLLM() {
    return this.messages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: msg.content
    }));
  }
}

export const messageStore = new MessageStore();

