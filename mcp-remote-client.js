#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  InitializeRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Check if fetch is available, import node-fetch as fallback
let fetchFunction;
if (typeof fetch !== 'undefined') {
  fetchFunction = fetch;
  console.error('Using built-in fetch');
} else {
  console.error('Built-in fetch not available, trying to import node-fetch');
  try {
    const nodeFetch = await import('node-fetch');
    fetchFunction = nodeFetch.default;
    console.error('Using node-fetch fallback');
  } catch (error) {
    console.error('Failed to import node-fetch:', error);
    throw new Error('No fetch implementation available');
  }
}

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

// Function to convert ChatGPT format tools to Claude format
function convertToolsForClaude(tools) {
  return tools.map(tool => {
    const claudeTool = {
      name: tool.name,
      description: tool.description,
      inputSchema: tool.input_schema // Convert input_schema to inputSchema
    };
    
    // Remove output_schema as Claude doesn't use it
    // Claude infers output format from the tool implementation
    
    return claudeTool;
  });
}

// Fetch tools from remote server
async function fetchRemoteTools() {
  try {
    console.error('Attempting to fetch tools from', REMOTE_SERVER_URL + '/tools');
    const response = await fetchFunction(`${REMOTE_SERVER_URL}/tools`);
    const data = await response.json();
    
    if (data.tools && Array.isArray(data.tools)) {
      console.error(`Successfully fetched ${data.tools.length} tools`);
      // Convert ChatGPT format to Claude format
      const claudeTools = convertToolsForClaude(data.tools);
      console.error(`Fetched ${claudeTools.length} tools from remote server`);
      return claudeTools;
    } else {
      console.error('Invalid tools response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch tools from remote server:', error);
    return [];
  }
}

// Initialize request handler
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  return {
    protocolVersion: '2024-11-05',
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: 'trilogy-ai-coe-remote-client',
      version: '1.0.0',
    },
  };
});

// List tools request handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = await fetchRemoteTools();
  return { tools };
});

// Call tool request handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Forward the tool call to the remote server
    const response = await fetchFunction(`${REMOTE_SERVER_URL}/tools/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Return the result in MCP format
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: 'Failed to execute tool',
            message: error.message,
          }),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  console.error('Trilogy AI CoE Remote MCP Client started');
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Failed to start MCP client:', error);
  process.exit(1);
}); 