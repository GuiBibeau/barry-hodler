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

| Path                  | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `src/`                | Main source directory                                                       |
| `src/index.ts`        | Application entry point. This is a "Keep It Clean" file, no trash in here.  |
| `src/config/`         | Configuration files                                                         |
| `src/config/*.ts`     | Example: constants.ts, env.ts                                               |
| `src/core/`           | Core application logic                                                      |
| `src/core/agent.ts`   | Main agent implementation                                                   |
| `src/core/*.ts`       | Core functionality files                                                    |
| `src/core/state/`     | State management                                                            |
| `src/core/state/*.ts` | Mobx state management. Eventually will be persisted to firebase             |
| `src/core/transport/` | Communication layers for LLM, compute, blockchain, etc.                     |
| `src/core/transport/*.ts` | API clients and interfaces                                              |
| `src/tools/`          | Tool implementations                                                        |
| `src/tools/*.ts`      | Tool routing and common code                                                |
| `src/tools/*/`        | Compute-related tools: tools in folders always contain a router and a tool generator. |
| `src/tools/*/*tools-router.ts` | Analyzes intent and handles clarifications                         |
| `src/tools/*/*tool-generator.ts` | Executes compute-related actions                                 |
| `src/tools/tool-router.ts` | Top level tool router                                                  |
| `src/utils/`          | Utility functions                                                           |
| `src/utils/*.ts`      | Helper functions and utilities                                              |

To do:

- [ ] set up bun tests
- [ ] work on new transports: twitter? discord? etc?
- [ ] wire fully a first tool to be executed and ran. (hyperfolic renting a GPU first TODO: @guibibeau)