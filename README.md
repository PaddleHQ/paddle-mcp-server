# MCP Server for Paddle Billing

[Paddle Billing](https://www.paddle.com/billing?utm_source=dx&utm_medium=paddle-mcp-server) is the developer-first merchant of record. We take care of payments, tax, subscriptions, and metrics with one unified API that does it all.

This is a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that provides tools for interacting with the Paddle API.

> **Important:** This MCP server works with Paddle Billing. It does not support Paddle Classic. To work with Paddle Classic, see: [Paddle Classic API reference](https://developer.paddle.com/classic/api-reference/1384a288aca7a-api-reference?utm_source=dx&utm_medium=paddle-mcp-server)

## Features

- List products in your Paddle catalog
- Create new products
- List prices for products
- Create new prices for products
- List customers
- List transactions
- List subscriptions
- Create custom reports for financial analysis

## Installation

To use the MCP server, you'll need an API key. You can create and manage API keys in **Paddle > Developer tools > Authentication**:

- Sandbox: https://sandbox-vendors.paddle.com/authentication-v2
- Live: https://vendors.paddle.com/authentication-v2

To run the server in a client like Claude Desktop, Cursor or Windsurf, add the following to your MCP config:

```json
{
  "mcpServers": {
    "paddle": {
      "command": "npx",
      "args": ["-y", "@paddle/paddle-mcp", "--api-key=PADDLE_API_KEY", "--environment=(sandbox|production)"]
    }
  }
}
```

Replace `PADDLE_API_KEY` with your API key, and pass the correct value as `environment`.

For detailed setup guides, see:

- [Claude Desktop](https://modelcontextprotocol.io/quickstart/user)
- [Cursor](https://docs.cursor.com/context/model-context-protocol)
- [Windsurf](https://docs.codeium.com/windsurf/mcp)

## Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Build the server:

   ```bash
   pnpm build
   ```

3. Update client to use the local build:
   ```json
   {
     "mcpServers": {
       "paddle": {
         "command": "node",
         "args": ["path/to/paddle-mcp-server/build/index.js"],
         "env": {
           "PADDLE_API_KEY": "your_api_key",
           "PADDLE_ENVIRONMENT": "sandbox"
         }
       }
     }
   }
   ```

## Debugging

To debug the MCP server, you can use the MCP Inspector tool:

1. Run the server with the inspector:

   ```bash
   pnpm inspector
   ```

2. Open the provided URL in your browser to view and debug the MCP requests and responses.

3. Include the `--api-key` and `--environment` arguments.

## Running evals

The evals package loads an mcp client that then runs the index.ts file, so there is no need to rebuild between tests. You can load environment variables by prefixing the npx command. Full documentation can be found [here](https://www.mcpevals.io/docs).

```bash
OPENAI_API_KEY=your-key  npx mcp-eval src/evals/evals.ts src/tools.ts
```

## Learn more

- [Paddle developer docs](https://developer.paddle.com?utm_source=dx&utm_medium=paddle-mcp-server)
- [Paddle API reference](https://developer.paddle.com/api-reference/overview?utm_source=dx&utm_medium=paddle-mcp-server)
- [Sign up for Paddle Billing](https://login.paddle.com/signup?utm_source=dx&utm_medium=paddle-mcp-server)
