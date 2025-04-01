import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import PaddleAPI from "./api.js";
import tools from "./tools.js";

class PaddleMCPServer extends McpServer {
  private _paddle: PaddleAPI;

  constructor({ apiKey, environment }: { apiKey: string; environment: string }) {
    super({
      name: "paddle",
      version: "0.1.2",
    });

    this._paddle = new PaddleAPI(apiKey, environment);

    tools.forEach((tool) => {
      this.tool(
        tool.method,
        tool.description,
        tool.parameters.shape,
        async (arg: unknown, _extra: RequestHandlerExtra) => {
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
    });
  }
}

export default PaddleMCPServer;
