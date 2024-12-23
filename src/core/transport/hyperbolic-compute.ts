interface HyperbolicMachine {
  id: string;
  status: string;
  cluster_name: string;
  gpus_total: number;
  gpus_reserved: number;
  reserved: boolean;
  pricing: {
    price: {
      amount: number;
      period: string;
      agent: string;
    }
  }
}

export interface CreateInstanceParams {
  cluster_name: string;
  node_name: string;
  gpu_count: number;
  image?: {
    name: string;
    tag: string;
    port: number;
  }
}

export class HyperbolicCompute {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.HYPERBOLIC_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('HYPERBOLIC_API_KEY environment variable is required');
    }
    this.baseUrl = 'https://api.hyperbolic.xyz/v1';
  }

  private getHeaders(requiresAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (requiresAuth) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  private async fetchWithError(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async listAvailableMachines(filters = {}): Promise<HyperbolicMachine[]> {
    const response = await this.fetchWithError(`${this.baseUrl}/marketplace`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ filters })
    });
    return response.instances;
  }

  async createInstance(params: CreateInstanceParams) {
    return await this.fetchWithError(`${this.baseUrl}/marketplace/instances/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params)
    });
  }

  async listUserInstances() {
    return await this.fetchWithError(`${this.baseUrl}/marketplace/instances`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({})
    });
  }

  async getInstanceHistory() {
    return await this.fetchWithError(`${this.baseUrl}/marketplace/instances/history`, {
      method: 'GET',
      headers: this.getHeaders()
    });
  }

  async findAvailableGPU(minGPUs: number = 1): Promise<HyperbolicMachine | null> {
    const machines = await this.listAvailableMachines();
    return machines.find(machine => 
      machine.status === 'node_ready' &&
      !machine.reserved &&
      (machine.gpus_total - machine.gpus_reserved) >= minGPUs
    ) || null;
  }
}
