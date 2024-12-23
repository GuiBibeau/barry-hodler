import { HyperbolicCompute, type CreateInstanceParams } from '../../core/transport/hyperbolic-compute';
import type { LLMClient, Message } from "../../core/types";

interface ComputeToolResponse {
  action: 'list_machines' | 'create_instance' | 'list_instances' | 'get_history' | 'find_gpu' | 'need_clarification';
  reason: string;
}

export class ComputeManager {
  private hyperbolic: HyperbolicCompute;
  private llmClient: LLMClient;


  constructor(llmClient: LLMClient) {
    this.hyperbolic = new HyperbolicCompute();
    this.llmClient = llmClient;
  }

  async analyzeComputeIntent(userMessage: string, messageHistory: Message[] = []): Promise<ComputeToolResponse> {
    const systemPrompt: Message = {
      role: 'system' as const,
      content: `You are a compute tool router. Analyze if the user's message indicates they want to perform one of these actions:

      1. list_machines - When user wants to see available machines/GPUs
         Examples: "what GPUs do you have?", "show me available machines"
      
      2. create_instance - When user wants to start/create a new instance
         Examples: "start a new instance", "I need a GPU machine"
      
      3. list_instances - When user wants to see their current instances
         Examples: "show my instances", "what machines am I running?"
      
      4. get_history - When user wants to see past usage
         Examples: "show my usage history", "what instances did I use before?"
      
      5. find_gpu - When user has specific GPU requirements
         Examples: "I need a GPU with 24GB RAM", "find me a GPU for training"

      If the intent is unclear, respond with:
      {
        "action": "need_clarification",
        "reason": "Specific information needed - ask ONE clear question"
      }

      Otherwise, respond with:
      {
        "action": "action_name",
        "reason": "Brief explanation of selection"
      }

      Respond ONLY with valid JSON. Keep reasons brief and focused.`
    };

    const messages: Message[] = [
      systemPrompt,
      ...messageHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await this.llmClient.chat(
        messages,
        undefined,
        { temperature: 0 }
      );
      
      const parsed = JSON.parse(response);
      if (!parsed.action || !parsed.reason) {
        throw new Error('Invalid response format');
      }
      
      return parsed as ComputeToolResponse;
    } catch (error) {
      console.error('Failed to analyze compute intent:', error);
      throw new Error('Failed to analyze compute intent');
    }
  }


}
