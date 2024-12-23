import type { LLMClient, Message } from "../../core/types";
import type { CreateInstanceParams } from "../../core/transport/hyperbolic-compute";

interface GPURequirementResponse {
  minGPUs: number;
  reason: string;
}

interface CreateInstanceResponse {
  params: CreateInstanceParams;
  reason: string;
}

export class ComputeToolGenerator {
  private llmClient: LLMClient;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  // connecting to hyperbolic compute class will go here.

} 