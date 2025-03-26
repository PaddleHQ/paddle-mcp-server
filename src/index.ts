#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import PaddleMCPServer from "./toolkit.js";

const ACCEPTED_ARGS = ["api-key", "environment"];

type Options = {
  apiKey: string;
  environment: string;
};

function parseArgs(args: string[]) {
  const options: Options = {
    apiKey: "",
    environment: "",
  };

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");

      if (key == "api-key") {
        options.apiKey = value;
      } else if (key == "environment") {
        options.environment = value;
      } else {
        throw new Error(`Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(", ")}`);
      }
    }
  });

  // Check if API key is either provided in args or set in environment variables
  const apiKey = options.apiKey || process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Paddle API key not provided. Please either pass it as an argument --api-key=$KEY or set the PADDLE_API_KEY environment variable.",
    );
  }
  options.apiKey = apiKey;

  const environment = options.environment || process.env.PADDLE_ENVIRONMENT;

  if (!environment || (environment != "sandbox" && environment != "production")) {
    throw new Error(`Invalid environment: ${environment}. Accepted environments are: sandbox, production`);
  }
  options.environment = environment;

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Create the MCP server
  const server = new PaddleMCPServer({
    apiKey: options.apiKey,
    environment: options.environment,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
