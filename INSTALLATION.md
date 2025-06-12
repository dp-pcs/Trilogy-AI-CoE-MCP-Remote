# Installation Guide - Trilogy AI CoE Universal MCP Server

This guide will walk you through connecting to the **remote** Trilogy AI CoE MCP Server. No local server installation required - just connect your AI assistant to our live server!

## 🌟 What Makes This Universal

This MCP server demonstrates **"write once, use everywhere"** - one server works with multiple AI assistants:

- ✅ **Claude Desktop** - Native MCP integration
- ✅ **Cursor** - Same configuration works
- ✅ **ChatGPT** - HTTP endpoint compatibility (beta)
- ✅ **Any MCP-compatible client**

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- An MCP-compatible AI assistant:
  - [Claude Desktop](https://claude.ai/download)
  - [Cursor](https://cursor.sh/)

## Step 1: Get the MCP Client

### Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-username/Trilogy-AI-CoE-MCP-Remote.git
cd Trilogy-AI-CoE-MCP-Remote

# Install dependencies (for the client script)
npm install
```

### What You Get

- **`mcp-remote-client.js`** - Local client that connects to our remote server
- **Live server** - `https://ai-coe-mcp.latentgenius.ai` (no setup required)
- **Universal compatibility** - Works with Claude, Cursor, and more

## Step 2: Configure Your AI Assistant

### For Claude Desktop

1. **Find your Claude config directory**:
   - **macOS**: `~/Library/Application Support/Claude/`
   - **Linux**: `~/.config/claude/`
   - **Windows**: `%APPDATA%\Claude\`

2. **Edit `claude_desktop_config.json`** (create if it doesn't exist):

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/FULL/PATH/TO/Trilogy-AI-CoE-MCP-Remote/mcp-remote-client.js"]
    }
  }
}
```

**Important**: Replace `/FULL/PATH/TO/` with your actual path.

#### Finding Your Full Path

```bash
# In your project directory
pwd
echo "$(pwd)/mcp-remote-client.js"
```

### For Cursor

1. **Find your Cursor MCP config**:
   - **Location**: `~/.cursor/mcp.json`

2. **Edit `mcp.json`** (create if it doesn't exist):

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/FULL/PATH/TO/Trilogy-AI-CoE-MCP-Remote/mcp-remote-client.js"]
    }
  }
}
```

### For ChatGPT (Beta)

ChatGPT uses the HTTP endpoint directly:

1. **Go to ChatGPT Settings → Connectors**
2. **Add MCP Server**:
   - **Name**: `Trilogy AI CoE MCP Server`
   - **URL**: `https://ai-coe-mcp.latentgenius.ai/mcp`
   - **Authentication**: `No authentication`

*Note: ChatGPT's MCP support is still in beta and may not work reliably.*

## Step 3: Test the Connection

1. **Restart your AI assistant** completely (quit and reopen)
2. **Test with these queries**:

```
Search for articles about agentic frameworks
```

```
Show me the 5 most recent articles
```

```
Find articles by David Proctor
```

## Available Tools

Once connected, your AI assistant can use these tools:

### 🔍 `search`
Search through Trilogy AI CoE articles by keywords, topics, or authors.

**Example**: "Search for articles about machine learning best practices"

### 📋 `list_recent`
Get the latest articles sorted by publication date.

**Example**: "Show me the 10 most recent articles"

### 📖 `fetch`
Retrieve full article content by ID for detailed analysis.

**Example**: "Fetch the full content of article-4"

## Architecture: How It Works

```
    🌐 Remote MCP Server (Cloud)
    ai-coe-mcp.latentgenius.ai
              │
              │ HTTPS
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
  Claude    Cursor   ChatGPT
 (client)  (client)  (direct)
```

- **Remote Server**: Runs in the cloud, always available
- **Local Client**: Bridges MCP protocol to HTTP calls
- **Universal**: Same server, different connection methods

## Troubleshooting

### Common Issues

#### 1. "No tools available" or "MCP server not found"

**Solutions**:
- Verify the path to `mcp-remote-client.js` is correct and absolute
- Ensure Node.js 18+ is installed: `node --version`
- Restart your AI assistant completely
- Check that the file has execute permissions: `chmod +x mcp-remote-client.js`

#### 2. "Connection failed" or "Server unreachable"

**Solutions**:
- Test the server directly: `curl https://ai-coe-mcp.latentgenius.ai/health`
- Check your internet connection
- Verify no firewall is blocking the connection

#### 3. "Module not found" errors

**Solutions**:
- Run `npm install` in the project directory
- Ensure you're using the correct Node.js version
- Check that all dependencies are installed

#### 4. Claude Desktop config issues

**Solutions**:
- Verify config file location (macOS: `~/Library/Application Support/Claude/`)
- Ensure JSON syntax is valid
- Use absolute paths, not relative paths
- Restart Claude Desktop after config changes

#### 5. Cursor MCP config issues

**Solutions**:
- Check config file location: `~/.cursor/mcp.json`
- Create the file if it doesn't exist
- Ensure JSON syntax is valid
- Restart Cursor after config changes

### Debug Mode

To see detailed connection logs, check your AI assistant's developer console or logs.

### Test the Server Directly

You can test the remote server directly:

```bash
# Health check
curl https://ai-coe-mcp.latentgenius.ai/health

# List available tools
curl https://ai-coe-mcp.latentgenius.ai/tools

# Test search
curl -X POST https://ai-coe-mcp.latentgenius.ai/tools/search \
  -H "Content-Type: application/json" \
  -d '{"query": "agentic frameworks"}'
```

## Quick Setup Script

For easy demo preparation, use our setup script:

```bash
# Run the demo prep script (if available)
./demo-prep.sh
```

This script will:
- Backup your existing MCP configurations
- Create clean configs for demo
- Verify the server is working
- Provide restore instructions

## Verification

After successful setup, you should be able to:

✅ Search for articles by keywords  
✅ Get recent articles with publication dates  
✅ Fetch full article content  
✅ Find articles by specific authors  
✅ Use the same tools across different AI assistants  

## Key Benefits

### 🌐 **No Local Server Required**
- Remote server is always running
- No installation or maintenance needed
- Automatic updates and improvements

### 🔄 **Universal Compatibility**
- Same server works with multiple AI assistants
- Each client uses their preferred integration method
- Future-proof: new AI assistants work immediately

### ⚡ **Production Ready**
- Hosted on AWS with high availability
- Built-in caching and error handling
- Real-time access to Trilogy AI CoE content

## Next Steps

- Explore the available tools and their capabilities
- Try different search queries to find relevant content
- Use the `fetch` tool to get complete article content
- Check out our [UNIVERSAL_SETUP.md](./UNIVERSAL_SETUP.md) for more examples

## Support

For additional support:
- Check the main [README.md](./README.md)
- Test the server health: `https://ai-coe-mcp.latentgenius.ai/health`
- Review the [CHATGPT_CONNECTOR_SETUP.md](./CHATGPT_CONNECTOR_SETUP.md) for ChatGPT-specific setup
- Open an issue on GitHub

---

**🌟 This demonstrates the true power of MCP: write once, use everywhere! 🌟** 