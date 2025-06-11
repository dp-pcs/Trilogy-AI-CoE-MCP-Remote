# AI CoE Trilogy MCP Remote Server

A **remote** Model Context Protocol (MCP) server that connects to Substack feeds to provide AI assistants with access to articles, authors, and topics from the AI Center of Excellence at Trilogy. This server runs as a web service deployed on AWS, eliminating the need for users to host the MCP server locally.

## 🌐 Live Server

**Server URL:** `https://ai-coe-mcp.latentgenius.ai`

This server is live and ready to use! No installation required - just connect your AI assistant.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. This remote server implementation provides HTTP endpoints that MCP-compatible applications can connect to over the internet.

## Features

- 🌐 **Remote Access**: No local installation required - connect from anywhere
- 📚 **List Articles**: Browse available articles from the Substack feed
- 👥 **List Authors**: View all authors who have contributed content
- 🏷️ **List Topics**: Explore articles by topic/category
- 📖 **Read Articles**: Access full article content
- 🔍 **Filter Content**: Search by author, topic, or keywords
- 🔌 **HTTP API**: RESTful endpoints for easy integration
- ⚡ **Fast & Reliable**: Built-in caching and error handling
- 🚀 **Cloud Hosted**: Deployed on AWS Elastic Beanstalk
- 🔧 **Node.js Compatible**: Includes polyfills for web API compatibility

## Quick Start - Connect Your AI Assistant

### For Claude Desktop

Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch", "http://ai-coe-mcp.latentgenius.ai"]
    }
  }
}
```

### For Cursor

Add to your MCP settings:
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch", "http://ai-coe-mcp.latentgenius.ai"]
    }
  }
}
```

### For Other MCP-Compatible Applications

Use the server URL: `http://ai-coe-mcp.latentgenius.ai`

## API Endpoints

The server provides these HTTP endpoints:

### `GET /`
Server information and available endpoints.

**Example:**
```bash
curl http://ai-coe-mcp.latentgenius.ai/
```

### `GET /health`
Health check endpoint.

**Example:**
```bash
curl http://ai-coe-mcp.latentgenius.ai/health
```

### `GET /tools`
List all available MCP tools with their schemas.

**Example:**
```bash
curl http://ai-coe-mcp.latentgenius.ai/tools
```

### `POST /tools/list_articles`
Get a list of available articles with optional filtering.

**Request Body:**
```json
{
  "limit": 10,
  "author": "John Smith",
  "topic": "AI Strategy"
}
```

**Example:**
```bash
curl -X POST http://ai-coe-mcp.latentgenius.ai/tools/list_articles \
  -H "Content-Type: application/json" \
  -d '{"limit": 5}'
```

### `POST /tools/list_authors`
Get all authors who have written articles.

**Example:**
```bash
curl -X POST http://ai-coe-mcp.latentgenius.ai/tools/list_authors \
  -H "Content-Type: application/json" \
  -d '{}'
```

### `POST /tools/list_topics`
Get available topics/categories covered in articles.

**Example:**
```bash
curl -X POST http://ai-coe-mcp.latentgenius.ai/tools/list_topics \
  -H "Content-Type: application/json" \
  -d '{}'
```

### `POST /tools/read_article`
Read the full content of a specific article.

**Request Body:**
```json
{
  "articleId": "article-1",
  "url": "https://trilogyai.substack.com/p/article-title",
  "title": "Article Title"
}
```

**Example:**
```bash
curl -X POST http://ai-coe-mcp.latentgenius.ai/tools/read_article \
  -H "Content-Type: application/json" \
  -d '{"title": "Agentic Frameworks"}'
```

## Available MCP Tools

When connected via MCP, your AI assistant can use these tools:

### `list_articles`
- **Description**: List articles from the AI CoE Trilogy Substack feed
- **Parameters**: 
  - `limit` (optional): Maximum number of articles (default: 10)
  - `author` (optional): Filter by author name
  - `topic` (optional): Filter by topic

### `list_authors`
- **Description**: List all authors who have written articles
- **Returns**: Authors with article counts and latest publication dates

### `list_topics`
- **Description**: List all topics/categories covered in articles
- **Returns**: Topics with article counts and associated articles

### `read_article`
- **Description**: Read the full content of a specific article
- **Parameters**:
  - `articleId` (optional): The ID of the article
  - `url` (optional): The URL of the article
  - `title` (optional): Search by title

## Example Usage

Once connected, ask your AI assistant:
- "List the latest articles from the AI CoE"
- "Show me all authors"
- "What topics are covered?"
- "Read the article about Agentic Frameworks"
- "Find articles by David Proctor"
- "Show me articles about AI strategy"

## Server Information

- **Hosting**: AWS Elastic Beanstalk
- **Region**: us-east-1
- **Custom Domain**: ai-coe-mcp.latentgenius.ai
- **Uptime**: 24/7 availability
- **Caching**: 5-minute cache for optimal performance
- **Data Source**: https://trilogyai.substack.com

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
curl http://localhost:3000/health
curl http://localhost:3000/tools
curl -X POST http://localhost:3000/tools/list_articles -H "Content-Type: application/json" -d '{"limit": 5}'
```

## Troubleshooting

### Common Issues

1. **Connection errors**: Verify the server URL is correct
2. **MCP not working**: Ensure you're using the correct configuration format
3. **No articles returned**: Check your internet connection and try again

### Getting Help

1. Test the server directly: `curl http://ai-coe-mcp.latentgenius.ai/health`
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

The server provides real-time access to AI CoE content, enabling AI assistants to stay current with the latest insights, strategies, and best practices in artificial intelligence. 