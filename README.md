# Trilogy AI CoE MCP Server

A **universal** Model Context Protocol (MCP) server demonstrating how one server can connect to multiple AI assistants. This server provides access to Trilogy's AI Center of Excellence Substack content and showcases MCP's true power: **write once, use everywhere**.

## 🌟 Universal Compatibility Showcase

This project demonstrates MCP's core value proposition:

- ✅ **One Server** → Multiple AI Clients
- ✅ **Claude Desktop** - Full MCP integration
- ✅ **Cursor** - Same configuration works
- ✅ **ChatGPT Deep Research** - HTTP endpoint compatibility
- ✅ **Any MCP Client** - Standard protocol compliance

## 🚀 Live Demo Server

**Server URL:** `https://ai-coe-mcp.latentgenius.ai`

Ready to use immediately - no installation required!

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. This project showcases how a single MCP server can serve multiple AI clients with different integration approaches.

## Quick Start - Universal Setup

### Option 1: Claude Desktop & Cursor (Native MCP)

1. **Download the client script**: Save [`mcp-remote-client.js`](./mcp-remote-client.js) to your local machine

2. **Configure your AI assistant**:

**Claude Desktop** (`claude_desktop_config.json`):
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

**Cursor** (same configuration in MCP settings):
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

3. **Restart your AI assistant** and start using the tools!

### Option 2: ChatGPT Deep Research (HTTP Endpoint)

1. **Go to ChatGPT Settings → Connectors**
2. **Add MCP Server**:
   - **Name**: `Trilogy AI CoE MCP Server`
   - **URL**: `https://ai-coe-mcp.latentgenius.ai/mcp`
   - **Authentication**: `No authentication`
3. **Use Deep Research** with Trilogy AI CoE content!

## Available Tools

All AI assistants get access to these tools:

### 🔍 `search`
Search through Trilogy AI CoE articles by keywords, topics, or authors.

**Example**: "Search for articles about agentic frameworks"

### 📋 `list_recent`  
Get the latest articles sorted by publication date.

**Example**: "Show me the 5 most recent articles"

### 📖 `fetch`
Retrieve full article content by ID for detailed analysis.

**Example**: "Fetch the full content of article-4"

## Example Usage

Once connected, try these queries in any supported AI assistant:

- "Search for articles about agentic frameworks"
- "What are the latest AI strategy insights?"
- "Find articles by David Proctor"
- "Show me recent content on machine learning"
- "Fetch the full article about AI transformation"

## Architecture: One Server, Multiple Clients

```
┌─────────────────────────────────────────────────────────────┐
│                    MCP Server                               │
│              (ai-coe-mcp.latentgenius.ai)                  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Search    │  │ List Recent │  │    Fetch    │        │
│  │    Tool     │  │    Tool     │  │    Tool     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Multiple Protocol Support
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Claude    │      │   Cursor    │      │  ChatGPT    │
│  Desktop    │      │             │      │Deep Research│
│             │      │             │      │             │
│ (stdio MCP) │      │ (stdio MCP) │      │(HTTP JSON-RPC)│
└─────────────┘      └─────────────┘      └─────────────┘
```

## Testing the Server

You can test the server directly using HTTP endpoints:

```bash
# Health check
curl https://ai-coe-mcp.latentgenius.ai/health

# List available tools
curl https://ai-coe-mcp.latentgenius.ai/tools

# Search for articles
curl -X POST https://ai-coe-mcp.latentgenius.ai/tools/search \
  -H "Content-Type: application/json" \
  -d '{"query": "agentic frameworks"}'

# Test MCP protocol (ChatGPT format)
curl -X POST https://ai-coe-mcp.latentgenius.ai/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

## Local Development

Want to run your own instance?

```bash
# Clone and setup
git clone https://github.com/your-username/trilogy-ai-coe-mcp-remote.git
cd trilogy-ai-coe-mcp-remote
npm install

# Configure environment
cp env.example .env
# Edit .env with your settings

# Build and run
npm run build
npm start

# Development mode
npm run dev
```

## Key Features

- 🌐 **Remote Deployment**: Cloud-hosted, no local installation needed
- 🔄 **Universal Protocol**: Works with any MCP-compatible client
- 🚀 **Multiple Interfaces**: stdio MCP + HTTP JSON-RPC
- ⚡ **Real-time Data**: Live access to Trilogy AI CoE content
- 🔒 **Secure**: HTTPS endpoints with proper CORS
- 📊 **Reliable**: Built-in caching and error handling

## Documentation

- **[ChatGPT Setup Guide](./CHATGPT_CONNECTOR_SETUP.md)** - Detailed ChatGPT Deep Research setup
- **[Installation Guide](./INSTALLATION.md)** - Local installation instructions  
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy your own instance

## About This Project

This project demonstrates the power of the Model Context Protocol to create **universal AI tool integrations**. By implementing both stdio MCP (for Claude/Cursor) and HTTP JSON-RPC (for ChatGPT), a single server can serve multiple AI assistants with their preferred integration methods.

**Key Insight**: MCP enables developers to write tools once and use them across the entire AI ecosystem, rather than building separate integrations for each AI assistant.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Submit a pull request

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Built by the AI Center of Excellence at Trilogy** to showcase practical MCP implementations and universal AI assistant integrations. 