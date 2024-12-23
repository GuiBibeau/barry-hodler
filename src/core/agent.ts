import { GroqClient } from "./transport/groq-client";
import { HyperbolicClient } from "./transport/hyperbolic-client";
import type { LLMClient } from "./types";
import { ToolRouter } from "../tools/tool-router";
import { messageStore } from "./state/messages";
import { createSpinner } from "../utils/spinner";
import { ComputeManager } from "../tools/compute/compute-tools-router";
import { terminalStore } from './state/terminal';
import { ShutdownHandler } from '../utils/shutdown-handler';

export class Agent {
    private client: LLMClient;
    private toolRouter: ToolRouter;
    private shutdownHandler: ShutdownHandler;
    private computeManager: ComputeManager;
    
    constructor(clientType: "groq" | "hyperbolic" = "hyperbolic") {
    this.client = this.createClient(clientType);
    this.toolRouter = new ToolRouter(this.client);
    this.shutdownHandler = new ShutdownHandler();
    this.computeManager = new ComputeManager(this.client);
  }

  private createClient(clientType: "groq" | "hyperbolic"): LLMClient {
    switch (clientType) {
      case "groq":
        return new GroqClient();
      case "hyperbolic":
        return new HyperbolicClient();
      default:
        throw new Error(`Unsupported client type: ${clientType}`);
    }
  }

  private async processUserInput(input: string) {
    try {
      messageStore.addUserMessage(input);
      terminalStore.handleUserInput(input);

      const toolUseAnalysis = await this.toolRouter.analyzeUserIntent(
        input,
        messageStore.messagesForLLM
      );

      if (toolUseAnalysis.type === 'need_clarification') {
        messageStore.addAssistantMessage(toolUseAnalysis.followUpQuestion!);
        terminalStore.handleAssistantResponse(toolUseAnalysis.followUpQuestion!);
      }

      if (toolUseAnalysis.type === 'tool') {
        switch (toolUseAnalysis.category) {
          case 'compute':
            const computeResponse = await this.computeManager.analyzeComputeIntent(
              input,
              messageStore.messagesForLLM
            );
            console.log(computeResponse);
            terminalStore.addMessage(JSON.stringify(computeResponse, null, 2), 'info');
            break;
          default:
            break;
        }
      }
    } catch (error) {
      terminalStore.handleError(error);
    }
  }

  private async startInputLoop() {
    terminalStore.initialize();

    const reader = Bun.stdin.stream().getReader();
    while (this.shutdownHandler.running) {
      const { done, value } = await reader.read();
      if (done) break;
      const input = Buffer.from(value).toString().trim();
      await this.processUserInput(input);
    }
  }

  public async start() {
    try {
      console.log("Starting agent...");
      this.shutdownHandler.setupHandlers();
      await this.startInputLoop();
    } catch (error) {
      console.error("Failed to start agent:", error);
      process.exit(1);
    }
  }
}
