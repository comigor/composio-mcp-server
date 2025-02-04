import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js";
import { LangchainToolSet } from "composio-core";

const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;

if (!COMPOSIO_API_KEY) {
  throw new Error("COMPOSIO_API_KEY is not set");
}

const toolSet = new LangchainToolSet({
  apiKey: COMPOSIO_API_KEY,
});

// Initialize MCP server
const server = new McpServer({
  name: "composio",
  version: "1.0.0",
});

/**
 * Adds Composio tools from a specific app to the MCP server
 * @param server - The MCP server instance
 * @param appName - Name of the Composio app to add tools from
 */
async function addComposioTool(server: McpServer, appName: string): Promise<void> {
  const actions = await toolSet.getTools({
    apps: [appName],
  });

  for (const action of actions) {
    const toolName = action.name;
    
    server.tool(
      toolName,
      action.description ?? "No description provided",
      { params: action.schema },
      async ({ params = {} }, extra: RequestHandlerExtra) => {
        try {
          const response = await toolSet.executeAction({
            action: action.name,
            params: params as Record<string, unknown>,
            entityId: "default",
          });

          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        } catch (error) {
          console.error(`Error executing ${toolName}:`, error);
          return {
            content: [{ type: "text", text: "An error occurred while executing the tool" }],
          };
        }
      },
    );
  }
}

/**
 * Main application entry point
 */
async function main(): Promise<void> {
  try {
    // Add tools from various Composio apps
    await Promise.all([
      addComposioTool(server, "gmail"),
      addComposioTool(server, "linear"),
      addComposioTool(server, "composio"),
    ]);

    // Initialize and connect transport
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.log("Composio MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});