import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import PaddleAPI from "./api.js";
import tools, { Tool } from "./tools.js";

export type ToolFilterMode = "all" | "read-only" | "non-destructive" | "specific";

export type ToolFilter = {
  mode: ToolFilterMode;
  tools?: string[];
};

class PaddleMCPServer extends McpServer {
  private _paddle: PaddleAPI;

  constructor({ apiKey, environment, toolFilter = { mode: "non-destructive" } }: { apiKey: string; environment: string; toolFilter?: ToolFilter }) {
    super({
      name: "paddle",
      version: "0.1.3",
    });

    this._paddle = new PaddleAPI(apiKey, environment);

    // Validate tools
    let requestedTools: Set<string> | undefined;
    if (toolFilter.mode === "specific" && toolFilter.tools) {
      requestedTools = new Set(toolFilter.tools);
      
      const availableTools = new Set<string>(tools.map((tool) => tool.method));
      const invalidTools = toolFilter.tools.filter((method) => !availableTools.has(method));
      
      if (invalidTools.length > 0) {
        throw new Error(
          `Invalid tool value(s) provided: ${invalidTools.join(", ")}. ` +
          `Accepted values are all, read-only, non-destructive, or a comma-separated list of valid tools: ${Array.from(availableTools).sort().join(", ")}`
        );
      }
    }

    // Register tools
    let registeredCount = 0;
    const isWriteTool = (tool: Tool) => Object.values(tool.actions).some((action) => action.write === true);
    const isDestructiveTool = (tool: Tool) => Object.values(tool.actions).some((action) => action.delete === true || action.update === true);

    tools.forEach((tool) => {
      const write = isWriteTool(tool);
      const destructive = isDestructiveTool(tool);

      let shouldRegister = false;
      
      if (toolFilter.mode === "all") {
        shouldRegister = true;
      } else if (toolFilter.mode === "read-only") {
        shouldRegister = !write;
      } else if (toolFilter.mode === "non-destructive") {
        shouldRegister = !destructive;
      } else if (toolFilter.mode === "specific") {
        shouldRegister = requestedTools?.has(tool.method) ?? false;
      }

      if (!shouldRegister) {
        return;
      }

      const annotations = {
        readOnlyHint: !write,
        destructiveHint: write ? destructive : undefined,
      };

      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        annotations,
        async (arg: unknown, _extra: unknown) => {
          const result = await this._paddle.run(tool.method, arg);
          return {
            content: [
              {
                type: "text" as const,
                text: String(result),
              },
            ],
          };
        },
      );

      registeredCount++;
    });

    if (registeredCount === 0) {
      throw new Error(
        "No tools were registered with the current filter settings. " +
        "The value of the --tools parameter must be 'all', 'read-only', 'non-destructive', or a comma-separated list of valid tools."
      );
    }
  }
}

export default PaddleMCPServer;
