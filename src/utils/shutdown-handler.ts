export class ShutdownHandler {
    private isRunning: boolean;
    private cleanupCallback?: () => Promise<void>;
  
    constructor(cleanupCallback?: () => Promise<void>) {
      this.isRunning = true;
      this.cleanupCallback = cleanupCallback;
    }
  
    setupHandlers() {
      const shutdown = async (signal: string) => {
        console.log(`\n\nReceived ${signal}. Shutting down gracefully...`);
        this.isRunning = false;
  
        if (this.cleanupCallback) {
          try {
            await this.cleanupCallback();
            console.log("Cleanup completed successfully");
          } catch (error) {
            console.error("Error during cleanup:", error);
          }
        }
  
        process.exit(0);
      };
  
      process.on("SIGTERM", () => shutdown("SIGTERM"));
      process.on("SIGINT", () => shutdown("SIGINT"));
      process.on("uncaughtException", (error) => {
        console.error("Uncaught Exception:", error);
        shutdown("uncaughtException");
      });
      process.on("unhandledRejection", (reason) => {
        console.error("Unhandled Rejection:", reason);
        shutdown("unhandledRejection");
      });
    }
  
    get running(): boolean {
      return this.isRunning;
    }
  }