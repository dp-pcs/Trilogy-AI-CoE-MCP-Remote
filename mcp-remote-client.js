#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const REMOTE_SERVER_URL = 'https://ai-coe-mcp.latentgenius.ai';

// Create MCP server that proxies to remote HTTP server
const server = new Server(
  {
    name: 'trilogy-ai-coe-remote-client',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Fetch tools from remote server
async function fetchRemoteTools() {
  try {
    const response = await fetch(`${REMOTE_SERVER_URL}/tools`);
    const data = await response.json();
    return data.tools || [];
  } catch (error) {
    console.error('Failed to fetch tools from remote server:', error);
    return [];
  }
}

// Execute tool on remote server
async function executeRemoteTool(toolName, args) {
  try {
    const response = await fetch(`${REMOTE_SERVER_URL}/tools/${toolName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Failed to execute tool ${toolName}:`, error);
    throw error;
  }
}

// Handle initialization
server.setRequestHandler(InitializeRequestSchema, async () => {
  return {
    protocolVersion: "2024-11-05",
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: "trilogy-ai-coe-remote-client",
      version: "1.0.0",
    },
  };
});

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = await fetchRemoteTools();
  console.error(`Fetched ${tools.length} tools from remote server`);
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    const result = await executeRemoteTool(name, args || {});
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Trilogy AI CoE Remote MCP Client started');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 