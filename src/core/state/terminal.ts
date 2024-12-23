import { makeAutoObservable } from 'mobx';

interface TerminalMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'system' | 'user-input' | 'assistant' | 'error' | 'info';
  status?: 'thinking' | 'complete' | 'error';
}

class TerminalStore {
  messages: TerminalMessage[] = [];
  isThinking: boolean = false;
  prompt: string = '$ ';

  constructor() {
    makeAutoObservable(this);
  }

  addMessage(content: string, type: TerminalMessage['type']) {
    const message: TerminalMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      type,
      status: type === 'assistant' ? 'complete' : undefined
    };
    this.messages.push(message);
  }

  setThinking(thinking: boolean) {
    this.isThinking = thinking;
  }

  setPrompt(prompt: string) {
    this.prompt = prompt;
  }

  clearScreen() {
    console.clear();
    this.renderLatestMessages();
  }

  renderLatestMessages(count: number = 10) {
    const recentMessages = this.messages.slice(-count);
    console.clear();
    recentMessages.forEach(msg => {
      switch (msg.type) {
        case 'error':
          console.error(msg.content);
          break;
        case 'system':
          console.log(`\x1b[90m${msg.content}\x1b[0m`); // Gray color
          break;
        case 'assistant':
          console.log(`\x1b[36m${msg.content}\x1b[0m`); // Cyan color
          break;
        case 'user-input':
          console.log(`\x1b[33m${this.prompt}${msg.content}\x1b[0m`); // Yellow color
          break;
        default:
          console.log(msg.content);
      }
    });

    if (this.isThinking) {
      process.stdout.write(`${this.prompt}Thinking...\r`);
    } else {
      process.stdout.write(this.prompt);
    }
  }

  async handleUserInput(input: string) {
    this.addMessage(input, 'user-input');
    this.setThinking(true);
  }

  handleAssistantResponse(response: string) {
    this.setThinking(false);
    this.addMessage(response, 'assistant');
    this.renderLatestMessages();
  }

  handleError(error: any) {
    this.addMessage(`Error processing input: ${error}`, 'error');
    this.setThinking(false);
    this.renderLatestMessages();
  }

  initialize() {
    this.clearScreen();
    const welcomeMessage = "Hello! How can I help you today?";
    this.addMessage(welcomeMessage, 'assistant');
    this.renderLatestMessages();
  }
}

export const terminalStore = new TerminalStore(); 