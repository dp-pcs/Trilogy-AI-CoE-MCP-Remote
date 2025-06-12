# AI CoE Trilogy MCP Remote Server

A **remote** Model Context Protocol (MCP) server that connects to Substack feeds to provide AI assistants with access to articles, authors, and topics from the AI Center of Excellence at Trilogy. This server runs as a web service deployed on AWS, eliminating the need for users to host the MCP server locally.

**✨ Now compatible with ChatGPT's Deep Research feature!**

## 🌐 Live Server

**Server URL:** `https://ai-coe-mcp.latentgenius.ai`

This server is live and ready to use! No installation required - just connect your AI assistant.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. This remote server implementation provides HTTP endpoints that MCP-compatible applications can connect to over the internet.

## Features

- 🌐 **Remote Access**: No local installation required - connect from anywhere
- 🔍 **Search Articles**: Search through Trilogy AI CoE articles by keywords, topics, or authors
- 📖 **Fetch Content**: Retrieve full article content with proper citations
- 🤖 **ChatGPT Compatible**: Fully supports ChatGPT's Deep Research MCP connector
- 🔌 **HTTP API**: RESTful endpoints for easy integration
- ⚡ **Fast & Reliable**: Built-in caching and error handling
- 🚀 **Cloud Hosted**: Deployed on AWS Elastic Beanstalk with HTTPS
- 🔧 **Node.js Compatible**: Includes polyfills for web API compatibility

## Quick Start - Connect Your AI Assistant

### For ChatGPT (Recommended)

**📋 For complete setup instructions with detailed usage guidelines, see [CHATGPT_CONNECTOR_SETUP.md](./CHATGPT_CONNECTOR_SETUP.md)**

**Quick Setup:**
1. Go to ChatGPT Settings → Connectors
2. Add a new MCP Server with:
   - **Name**: `Trilogy AI CoE MCP Server`
   - **Description**: `Access to Trilogy AI Center of Excellence articles and insights for enterprise AI strategy, implementation, and thought leadership`
   - **MCP Server URL**: `https://ai-coe-mcp.latentgenius.ai/mcp`
   - **Authentication**: `No authentication`
3. **Important**: Copy the detailed usage instructions from [CHATGPT_CONNECTOR_SETUP.md](./CHATGPT_CONNECTOR_SETUP.md) into the connector's description field
4. Save and start using Deep Research with Trilogy AI CoE content!

**Why detailed instructions matter**: ChatGPT's Deep Research feature works best when it understands exactly what content is available and how to search effectively. The detailed usage instructions act as a "prompt" that helps ChatGPT know when and how to use your connector optimally.

### For Claude Desktop

Create a local MCP client by saving this as `mcp-remote-client.js`:

```javascript
#!/usr/bin/env node

import fetch from 'node-fetch';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const REMOTE_SERVER_URL = 'https://ai-coe-mcp.latentgenius.ai';

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

// Proxy tools from remote server
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const response = await fetch(`${REMOTE_SERVER_URL}/tools`);
    const data = await response.json();
    return { tools: data.tools };
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    return { tools: [] };
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const response = await fetch(`${REMOTE_SERVER_URL}/tools/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {})
    });
    
    const result = await response.json();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Trilogy AI CoE Remote MCP Client started');
}

main().catch(console.error);
```

Then add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "trilogy-ai-coe-remote": {
      "command": "node",
      "args": ["/path/to/mcp-remote-client.js"]
    }
  }
}
```

### For Other MCP-Compatible Applications

Use the MCP server URL: `https://ai-coe-mcp.latentgenius.ai/mcp`

## API Endpoints

The server provides these HTTP endpoints:

### `GET /`
Server information and available endpoints.

**Example:**
```bash
curl https://ai-coe-mcp.latentgenius.ai/
```

### `GET /health`
Health check endpoint.

**Example:**
```bash
curl https://ai-coe-mcp.latentgenius.ai/health
```

### `POST /mcp`
MCP-over-HTTP endpoint for JSON-RPC 2.0 protocol (ChatGPT compatible).

**Example:**
```bash
curl -X POST https://ai-coe-mcp.latentgenius.ai/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

### `GET /tools`
List all available MCP tools with their schemas.

**Example:**
```bash
curl https://ai-coe-mcp.latentgenius.ai/tools
```

### `POST /tools/search`
Search through articles using keywords, topics, or author names.

**Request Body:**
```json
{
  "query": "AI machine learning strategy"
}
```

**Example:**
```bash
curl -X POST https://ai-coe-mcp.latentgenius.ai/tools/search \
  -H "Content-Type: application/json" \
  -d '{"query": "agentic frameworks"}'
```

### `POST /tools/fetch`
Retrieve full article content by ID.

**Request Body:**
```json
{
  "id": "article-id-here"
}
```

**Example:**
```bash
curl -X POST https://ai-coe-mcp.latentgenius.ai/tools/fetch \
  -H "Content-Type: application/json" \
  -d '{"id": "12345"}'
```

## Available MCP Tools

When connected via MCP, your AI assistant can use these tools:

### `search`
- **Description**: Searches for Trilogy AI Center of Excellence articles using keywords, topics, or author names
- **Parameters**: 
  - `query` (required): Search query string
- **Returns**: Array of matching articles with `id`, `title`, `text`, and `url`
- **Use Cases**: "Find articles about AI strategy", "Search for content by David Proctor"

### `fetch`
- **Description**: Retrieves detailed content for a specific article by ID
- **Parameters**:
  - `id` (required): The ID of the article to fetch
- **Returns**: Full article with `id`, `title`, `text`, `url`, and `metadata`
- **Use Cases**: Get complete article content for detailed analysis

## Example Usage

Once connected, ask your AI assistant:
- "Search for articles about agentic frameworks"
- "Find content related to AI strategy"
- "Look for articles by David Proctor"
- "Search for machine learning best practices"
- "Find articles about data science"

For ChatGPT Deep Research:
- "Research the latest AI trends from Trilogy's AI CoE"
- "What are the key insights on agentic AI frameworks?"
- "Analyze Trilogy's perspective on AI implementation strategies"

## Server Information

- **Hosting**: AWS Elastic Beanstalk
- **Region**: us-east-1
- **Custom Domain**: ai-coe-mcp.latentgenius.ai
- **HTTPS**: Fully secured with SSL certificate
- **Uptime**: 24/7 availability
- **Caching**: 5-minute cache for optimal performance
- **Data Source**: https://trilogyai.substack.com
- **ChatGPT Compatible**: Supports Deep Research MCP connector

## For Developers

If you want to deploy your own instance of this server, see [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions.

### Local Development

```bash
# Clone the repository
git clone https://github.com/dp-pcs/Trilogy-AI-CoE-MCP-Remote.git
cd Trilogy-AI-CoE-MCP-Remote

# Install dependencies
npm install

# Run in development mode (HTTP server)
npm run dev

# Or run in traditional MCP mode (stdio)
MODE=stdio npm run dev
```

### Testing

```bash
# Build and test
npm run build
npm test

# Test HTTP endpoints
curl https://ai-coe-mcp.latentgenius.ai/health
curl https://ai-coe-mcp.latentgenius.ai/tools

# Test search functionality
curl -X POST https://ai-coe-mcp.latentgenius.ai/tools/search \
  -H "Content-Type: application/json" \
  -d '{"query": "AI strategy"}'

# Test MCP protocol
curl -X POST https://ai-coe-mcp.latentgenius.ai/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

## Troubleshooting

### Common Issues

1. **Connection errors**: Verify the server URL is correct and uses HTTPS
2. **ChatGPT MCP not working**: Ensure you're using the `/mcp` endpoint
3. **No search results**: Try broader search terms or check your query
4. **Claude Desktop issues**: Verify the local client script has proper permissions

### Getting Help

1. Test the server directly: `curl https://ai-coe-mcp.latentgenius.ai/health`
2. Verify your MCP configuration matches the examples above
3. Check your AI assistant's MCP documentation
4. Open an issue on GitHub for additional support

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## About

This project demonstrates how to create a **remote** Model Context Protocol server that can be deployed to cloud platforms, making AI assistant integrations more accessible by eliminating the need for local server hosting. It's part of the AI Center of Excellence at Trilogy's initiative to showcase practical AI integration patterns.

The server provides real-time access to AI CoE content, enabling AI assistants to stay current with the latest insights, strategies, and best practices in artificial intelligence. With ChatGPT Deep Research compatibility, users can now perform comprehensive research using Trilogy's AI expertise directly within ChatGPT. 