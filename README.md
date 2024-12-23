# Barry Hodler  

Barry Hodler is a crypo bro agent that evolves on chain to invest, hodl and trade crypto.


To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```


# Project Structure

The folder structure has to grow organically and quite predictably so that we can even let the agent generate it's own code in the future. 🤯

📦 barry-hodler      
└── 📂 src                   
    ├── 📄 index.ts         # Application entry point. This is a "Keep It Clean" file, no trash in here.
    ├── 📂 config           # Configuration files
    │   └── 📄 *.ts         # Example: constants.ts, env.ts
    ├── 📂 core             # Core application logic
    │   ├── 📄 agent.ts     # Main agent implementation
    │   ├── 📄 *.ts         # Core functionality files
    │   ├── 📂 state        # State management
    │   │   └── 📄 *.ts     # Mobx state management. Eventually will be persisted to firebase
    │   └── 📂 transport    # Communication layers for LLM, compute, blockchain, etc.
    │       └── 📄 *.ts     # API clients and interfaces
    ├── 📂 tools            # Tool implementations
    │   ├── 📄 *.ts        # Tool routing and common code
    │   ├── 📂 *     # Compute-related tools: tools in folders always contain a router and a tool generator.
    │   │   ├── 📄 *tools-router.ts    # Analyzes intent and handles clarifications
    │   │   └── 📄 *tool-generator.ts  # Executes compute-related actions
    |   📄 tool-router.ts # Top level tool router
    └── 📂 utils           # Utility functions
        └── 📄 *.ts       # Helper functions and utilities

To do:

- [ ] set up bun tests
- [ ] work on new transports: twitter? discord? etc?
- [ ] wire fully a first tool to be executed and ran. (hyperfolic renting a GPU first TODO: @guibibeau)