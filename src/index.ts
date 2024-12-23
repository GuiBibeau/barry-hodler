import { Agent } from './core/agent';

const agent = new Agent('groq');

agent.start().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 