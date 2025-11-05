#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import PaddleMCPServer, { ToolFilterMode } from "./toolkit.js";

const ACCEPTED_ARGS = ["api-key", "environment", "tools"];

type Options = {
  apiKey: string;
  environment: string;
  toolFilter: {
    mode: ToolFilterMode;
    tools?: string[];
  };
};

function parseToolFilter(value: string | undefined, source: string): { mode: ToolFilterMode; tools?: string[] } {
  if (!value) {
    return { mode: "non-destructive" }; // Default is non-destructive (for security + backwards compatibility with existing tools)
  }
  
  if (value === "all") {
    return { mode: "all" };
  } else if (value === "read-only") {
    return { mode: "read-only" };
  } else if (value === "non-destructive") {
    return { mode: "non-destructive" };
  } else {
    const toolMethods = value.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    
    if (toolMethods.length === 0) {
      throw new Error(`Invalid ${source} value: ${value}. Accepted values are all, read-only, non-destructive, or a comma-separated list of valid tools.`);
    }
    return { mode: "specific", tools: toolMethods };
  }
}

function parseArgs(args: string[]) {
  const options: Options = {
    apiKey: "",
    environment: "",
    toolFilter: {
      mode: "non-destructive",
    },
  };
  
  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");

      if (key === "api-key") {
        options.apiKey = value;
      } else if (key === "environment") {
        options.environment = value;
      } else if (key === "tools") {
        options.toolFilter = parseToolFilter(value, "--tools argument");
      } else {
        throw new Error(`Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(", ")}`);
      }
    }
  });

  // Check if API key, environment, and tools are provided in args or set in environment variables
  const apiKey = options.apiKey || process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Paddle API key not provided. Please either pass it as an argument --api-key=$KEY or set the PADDLE_API_KEY environment variable.",
    );
  }
  options.apiKey = apiKey;

  const environment = options.environment || process.env.PADDLE_ENVIRONMENT;

  if (!environment || (environment !== "sandbox" && environment !== "production")) {
    throw new Error(`Invalid environment: ${environment}. Accepted environments are: sandbox, production`);
  }
  options.environment = environment;

  if (options.toolFilter.mode === "non-destructive" && process.env.PADDLE_MCP_TOOLS) {
    options.toolFilter = parseToolFilter(process.env.PADDLE_MCP_TOOLS, "PADDLE_MCP_TOOLS environment variable");
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  // Create the MCP server
  const server = new PaddleMCPServer({
    apiKey: options.apiKey,
    environment: options.environment,
    toolFilter: options.toolFilter,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
