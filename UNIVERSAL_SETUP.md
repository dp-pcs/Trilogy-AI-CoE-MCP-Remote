# Universal MCP Setup Guide

This guide demonstrates how **one MCP server** can connect to **multiple AI assistants** using their preferred integration methods.

## 🎯 The Universal MCP Promise

**Write once, use everywhere** - This server works with:

- ✅ **Claude Desktop** (stdio MCP)
- ✅ **Cursor** (stdio MCP) 
- ✅ **ChatGPT Deep Research** (HTTP JSON-RPC)
- ✅ **Any MCP-compatible client**

## 🚀 Live Server

**URL**: `https://ai-coe-mcp.latentgenius.ai`

## Setup Instructions

### For Claude Desktop & Cursor

**Step 1**: Download the client script
```bash
curl -O https://raw.githubusercontent.com/your-username/trilogy-ai-coe-mcp-server/main/mcp-remote-client.js
```

**Step 2**: Configure your AI assistant

**Claude Desktop** (`~/.config/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/path/to/mcp-remote-client.js"]
    }
  }
}
```

**Cursor** (Settings → MCP):
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node", 
      "args": ["/path/to/mcp-remote-client.js"]
    }
  }
}
```

**Step 3**: Restart your AI assistant

### For ChatGPT Deep Research

**Step 1**: Go to ChatGPT Settings → Connectors

**Step 2**: Add MCP Server
- **Name**: `Trilogy AI CoE`
- **URL**: `https://ai-coe-mcp.latentgenius.ai/mcp`
- **Authentication**: None

**Step 3**: Use Deep Research with MCP tools

## 🧪 Test Commands

Try these in any connected AI assistant:

```
Search for articles about agentic frameworks
```

```
Show me the 5 most recent articles
```

```
Fetch the full content of article-4
```

## 🏗️ Architecture

```
                    One MCP Server
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Claude Desktop     Cursor         ChatGPT
   (stdio MCP)     (stdio MCP)   (HTTP JSON-RPC)
```

## ✨ Key Insight

MCP enables **universal tool integration** - developers can create tools once and use them across the entire AI ecosystem, rather than building separate integrations for each AI assistant.

This is the power of open standards! 🌟 