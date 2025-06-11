# AI CoE Trilogy MCP Server

A Model Context Protocol (MCP) server that connects to Substack feeds to provide AI assistants with access to articles, authors, and topics from the AI Center of Excellence at Trilogy.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. Instead of building custom integrations for each AI platform, MCP provides a universal interface that works across Claude Desktop, Cursor, Windsurf, and other MCP-compatible applications.

## Features

- 📚 **List Articles**: Browse available articles from the Substack feed
- 👥 **List Authors**: View all authors who have contributed content
- 🏷️ **List Topics**: Explore articles by topic/category
- 📖 **Read Articles**: Access full article content
- 🔍 **Filter Content**: Search by author, topic, or keywords
- 🔌 **Universal Compatibility**: Works with any MCP-compatible AI assistant
- ⚡ **Fast & Reliable**: Built-in caching and error handling
- 🛠️ **Easy Setup**: Simple installation and configuration

## Quick Start

### 1. Install Dependencies

```bash
git clone https://github.com/your-username/Trilogy-AI-CoE-MCP.git
cd Trilogy-AI-CoE-MCP
npm install
```

### 2. Build the Server

```bash
npm run build
```

### 3. Test the Installation

```bash
npm test
```

### 4. Configure Your AI Assistant

Add this configuration to your AI assistant's MCP settings:

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/path/to/your/Trilogy-AI-CoE-MCP/dist/index.js"],
      "env": {
        "SUBSTACK_FEED_URL": "https://trilogyai.substack.com"
      }
    }
  }
}
```

### 5. Start Using

Ask your AI assistant:
- "List the latest articles from the AI CoE"
- "Show me all authors"
- "What topics are covered?"
- "Read the article about [topic]"

## Detailed Installation

For step-by-step installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

## Available Tools

The server provides these tools to AI assistants:

### `list_articles`
Get a list of available articles with optional filtering.

**Parameters:**
- `limit` (optional): Maximum number of articles to return (default: 10)
- `author` (optional): Filter articles by author name
- `topic` (optional): Filter articles by topic

**Example usage:**
- "List the 5 most recent articles"
- "Show me articles by John Smith"
- "Find articles about AI governance"

### `list_authors`
Get all authors who have written articles.

**Returns:** List of authors with article counts and latest publication dates.

### `list_topics`
Get available topics/categories covered in articles.

**Returns:** List of topics with article counts and associated articles.

### `read_article`
Read the full content of a specific article.

**Parameters:**
- `articleId` (optional): The ID of the article to read
- `url` (optional): The URL of the article to read
- `title` (optional): Search for article by title

**Example usage:**
- "Read the article about AI strategy"
- "Show me the full content of the latest article"

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Substack feed URL
SUBSTACK_FEED_URL=https://trilogyai.substack.com

# Optional: Enable debug logging
DEBUG=false

# Optional: Server port for testing
PORT=3000
```

### Custom Substack Feed

To use a different Substack publication:

1. Update `SUBSTACK_FEED_URL` in your `.env` file
2. Rebuild the server: `npm run build`
3. Restart your AI assistant

## Development

### Running in Development Mode

```bash
# Watch mode with auto-rebuild
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Project Structure

```
Trilogy-AI-CoE-MCP/
├── src/
│   └── index.ts          # Main server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── env.example           # Environment variables template
├── test-server.js        # Test script
├── README.md             # This file
├── INSTALLATION.md       # Detailed installation guide
└── DEMO_SCRIPT.md        # Demo recording script
```

## Supported AI Assistants

This MCP server works with:

- **Claude Desktop** - Full support with easy configuration
- **Cursor** - Full support via MCP settings
- **Windsurf** - Full support via MCP configuration
- **Any MCP-compatible application** - Universal protocol support

## Troubleshooting

### Common Issues

1. **Server won't start**: Check Node.js version (18+ required)
2. **No articles found**: Verify Substack feed URL and internet connection
3. **Permission errors**: Ensure proper file permissions for the server executable
4. **Path issues**: Use absolute paths in AI assistant configuration

### Debug Mode

Enable detailed logging by setting `DEBUG=true` in your environment or configuration.

### Getting Help

1. Check the [INSTALLATION.md](./INSTALLATION.md) guide
2. Review the [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for examples
3. Run `npm test` to verify your setup
4. Open an issue on GitHub for additional support

## Demo

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for a complete recording script demonstrating all features.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly: `npm test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## About

This project demonstrates how to create a Model Context Protocol server that connects AI assistants to external data sources. It's part of the AI Center of Excellence at Trilogy's initiative to showcase practical AI integration patterns. 