import type { Message, LLMClient } from "../core/types";

interface ToolAnalysisResponse {
  type: 'tool' | 'no_tool' | 'need_clarification';
  category?: 'compute';
  reason: string;
  followUpQuestion?: string;
}

export class ToolRouter {
  private llmClient: LLMClient;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  async analyzeUserIntent(userMessage: string, messageHistory: Message[] = []): Promise<ToolAnalysisResponse> {
    const systemPrompt: Message = {
      role: 'system',
      content: `You are a tool analyzer that determines if a user's message requires specific tools.
      
      Available tools:
      1. compute - For GPU/computing resource management (e.g., renting GPUs, listing machines, creating instances)
      
      Rules:
      - If user mentions anything about GPUs, machines, computing resources, or renting compute - classify as "tool" with "compute" category
      - If the intent is unclear or you need more information - classify as "need_clarification" with a specific follow-up question
      - If no tools are needed - classify as "no_tool"
      
      Respond ONLY with a JSON object in this format:
      {
        "type": "tool" | "no_tool" | "need_clarification",
        "category": "compute" (include only if type is "tool"),
        "reason": "Brief explanation of why this classification was chosen",
        "followUpQuestion": "Question to clarify user's intent" (include only if type is "need_clarification")
      }`
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
        { temperature: 0.1 }
      );
      
      return JSON.parse(response) as ToolAnalysisResponse;
    } catch (error) {
      console.error('Failed to analyze user intent:', error);
      throw new Error('Failed to analyze user intent');
    }
  }
}
