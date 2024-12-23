import type { Message, LLMResponse, LLMConfig, LLMClient, Tool } from "../types";

export class GroqClient implements LLMClient {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly defaultConfig: LLMConfig;

  constructor(config: LLMConfig = {}) {
    this.apiKey = config.apiKey || process.env.GROQ_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    this.defaultConfig = {
      model: 'llama-3.3-70b-versatile',
      maxTokens: 512,
      temperature: 0.1,
      topP: 0.9,
      stream: false,
      ...config
    };
  }

  async chat(
    messages: Message[],
    tools?: Tool[],
    config: Partial<LLMConfig> = {}
  ): Promise<string> {
    try {
      const requestConfig = { ...this.defaultConfig, ...config };
      const requestBody: Record<string, any> = {
        model: requestConfig.model,
        messages,
        max_tokens: requestConfig.maxTokens,
        temperature: requestConfig.temperature,
        top_p: requestConfig.topP,
        stream: requestConfig.stream,
      };

      if (tools?.length) {
        requestBody.tools = tools;
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json() as LLMResponse;
      return json.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }
} 