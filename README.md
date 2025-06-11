# AI CoE Trilogy MCP Remote Server

A **remote** Model Context Protocol (MCP) server that connects to Substack feeds to provide AI assistants with access to articles, authors, and topics from the AI Center of Excellence at Trilogy. This server runs as a web service that can be deployed to cloud platforms, eliminating the need for users to host the MCP server locally.

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
- 🚀 **Cloud Ready**: Designed for AWS Elastic Beanstalk, Docker, and other platforms
- 🔧 **Node.js Compatible**: Includes polyfills for web API compatibility

## Quick Start (Using the Remote Server)

### For AI Assistant Users

If someone has already deployed this server, you can connect to it directly:

```json
{
  "mcpServers": {
    "trilogy-ai-coe-remote": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch", "https://your-deployed-server.com"]
    }
  }
}
```

### For Server Deployment

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)

1. **Prerequisites**:
   - AWS CLI installed and configured
   - EB CLI installed (`pip install awsebcli`)

2. **Deploy**:
   ```bash
   git clone https://github.com/dp-pcs/Trilogy-AI-CoE-MCP-Remote.git
   cd Trilogy-AI-CoE-MCP-Remote
   npm install
   npm run build
   
   eb init --platform node.js --region us-east-1
   eb create trilogy-ai-coe-mcp
   eb deploy
   ```

3. **Get your server URL**:
   ```bash
   eb status
   ```

### Option 2: Docker Deployment

1. **Build and run locally**:
   ```bash
   docker build -t trilogy-ai-coe-mcp .
   docker run -p 3000:3000 -e SUBSTACK_FEED_URL=https://trilogyai.substack.com trilogy-ai-coe-mcp
   ```

2. **Deploy to cloud platforms**:
   - **AWS ECS**: Push to ECR and deploy with ECS
   - **Google Cloud Run**: `gcloud run deploy`
   - **Azure Container Instances**: `az container create`
   - **Railway**: Connect your GitHub repo
   - **Render**: Connect your GitHub repo

### Option 3: Traditional VPS/Server

1. **Setup on your server**:
   ```bash
   git clone https://github.com/dp-pcs/Trilogy-AI-CoE-MCP-Remote.git
   cd Trilogy-AI-CoE-MCP-Remote
   npm install
   npm run build
   
   # Set environment variables
   export MODE=http
   export PORT=3000
   export SUBSTACK_FEED_URL=https://trilogyai.substack.com
   
   # Start with PM2 (recommended)
   npm install -g pm2
   pm2 start dist/index.js --name trilogy-ai-coe-mcp
   ```

## API Endpoints

Once deployed, your server will provide these endpoints:

### `GET /`
Server information and available endpoints.

### `GET /health`
Health check endpoint.

### `GET /tools`
List all available MCP tools with their schemas.

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

### `POST /tools/list_authors`
Get all authors who have written articles.

### `POST /tools/list_topics`
Get available topics/categories covered in articles.

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

## Configuration

### Environment Variables

Set these environment variables for your deployment:

```env
# Required: Substack feed URL
SUBSTACK_FEED_URL=https://trilogyai.substack.com

# Server mode (always 'http' for remote server)
MODE=http

# Server port
PORT=3000

# Optional: Enable debug logging
DEBUG=false

# Node environment
NODE_ENV=production
```

### AWS Elastic Beanstalk Configuration

The `.ebextensions/nodejs.config` file contains the EB configuration:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.19.0
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    MODE: http
    PORT: 8080
    SUBSTACK_FEED_URL: https://trilogyai.substack.com
    DEBUG: false
```

## Connecting AI Assistants

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch", "https://your-server-url.com"]
    }
  }
}
```

### Cursor

Add to your MCP settings:

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-fetch", "https://your-server-url.com"]
    }
  }
}
```

## Development

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

### Project Structure

```
Trilogy-AI-CoE-MCP-Remote/
├── src/
│   ├── index.ts          # Main server implementation (HTTP + MCP)
│   └── polyfill.js       # Node.js web API compatibility polyfill
├── .ebextensions/        # AWS Elastic Beanstalk configuration
│   └── nodejs.config     # EB Node.js settings
├── dist/                 # Compiled JavaScript (generated)
├── Dockerfile            # Docker container configuration
├── .dockerignore         # Docker ignore file
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── env.example           # Environment variables template
├── test-server.js        # Test script
└── README.md             # This file
```

## Deployment Platforms

This server can be deployed to various platforms:

- **AWS Elastic Beanstalk** ✅ (Recommended - includes configuration)
- **AWS ECS/Fargate** ✅ (Use Docker)
- **Google Cloud Run** ✅ (Use Docker)
- **Azure Container Instances** ✅ (Use Docker)
- **Railway** ✅ (Connect GitHub repo)
- **Render** ✅ (Connect GitHub repo)
- **Heroku** ✅ (Connect GitHub repo)
- **DigitalOcean App Platform** ✅ (Use Docker)
- **Traditional VPS** ✅ (PM2 recommended)

## Cost Considerations

- **AWS Elastic Beanstalk**: ~$10-20/month for t3.micro instance
- **Google Cloud Run**: Pay per request, very cost-effective for low traffic
- **Railway/Render**: ~$5-10/month for hobby plans
- **VPS**: ~$5-20/month depending on provider

## Security

- CORS is enabled for cross-origin requests
- No authentication required (public read-only API)
- Rate limiting should be implemented for production use
- Consider adding API keys for private deployments

## Monitoring

- Health check endpoint: `GET /health`
- Debug logging available with `DEBUG=true`
- Consider adding application monitoring (New Relic, DataDog, etc.)

## Troubleshooting

### Common Issues

1. **Server won't start**: Check Node.js version (18+ required)
2. **No articles found**: Verify Substack feed URL and internet connection
3. **CORS errors**: Ensure CORS is properly configured
4. **Port issues**: Check PORT environment variable

### Debug Mode

Enable detailed logging by setting `DEBUG=true` in your environment.

### Getting Help

1. Check server logs for errors
2. Test endpoints directly with curl/Postman
3. Verify environment variables are set correctly
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