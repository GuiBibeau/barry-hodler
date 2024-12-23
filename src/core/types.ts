export interface Tool {
    type: string;
    function: {
      name: string;
      description: string;
      parameters: Record<string, any>;
    };
  }

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface LLMConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface LLMClient {
  chat(messages: Message[], tools?: Tool[], config?: Partial<LLMConfig>): Promise<string>;
}