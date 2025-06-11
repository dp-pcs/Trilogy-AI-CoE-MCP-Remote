# Installation Guide - Trilogy AI CoE MCP Server

This guide will walk you through installing and configuring the Trilogy AI CoE MCP Server to work with your AI assistant.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18 or higher** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- An MCP-compatible AI assistant:
  - [Claude Desktop](https://claude.ai/download)
  - [Cursor](https://cursor.sh/)
  - [Windsurf](https://codeium.com/windsurf)

## Step 1: Clone and Install

### Option A: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/your-username/Trilogy-AI-CoE-MCP.git
cd Trilogy-AI-CoE-MCP

# Install dependencies
npm install
```

### Option B: Download ZIP

1. Download the ZIP file from the GitHub repository
2. Extract it to your desired location
3. Open terminal/command prompt in the extracted folder
4. Run `npm install`

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your preferred settings
# The default Substack URL should work, but you can customize it
```

Example `.env` file:
```env
SUBSTACK_FEED_URL=https://trilogyai.substack.com
DEBUG=false
PORT=3000
```

## Step 3: Build the Server

```bash
# Build the TypeScript code
npm run build
```

This creates a `dist/` folder with the compiled JavaScript.

## Step 4: Test the Installation

```bash
# Run the test script
npm test
```

You should see output indicating the server started successfully and can fetch articles.

## Step 5: Configure Your AI Assistant

### For Claude Desktop

1. **Open Claude Desktop**
2. **Go to Settings** (gear icon in bottom left)
3. **Click on "Developer"** tab
4. **Edit the MCP configuration** by adding:

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
             "args": ["/FULL/PATH/TO/YOUR/Trilogy-AI-CoE-MCP/dist/index.js"],
       "env": {
         "SUBSTACK_FEED_URL": "https://trilogyai.substack.com"
       }
    }
  }
}
```

**Important**: Replace `/FULL/PATH/TO/YOUR/` with the actual path to your project folder.

#### Finding Your Full Path

**On macOS/Linux:**
```bash
cd /path/to/your/Trilogy-AI-CoE-MCP
pwd
```

**On Windows:**
```cmd
cd C:\path\to\your\Trilogy-AI-CoE-MCP
cd
```

### For Cursor

1. **Open Cursor**
2. **Go to Settings** (Cmd/Ctrl + ,)
3. **Search for "MCP"** in settings
4. **Add the same configuration** as Claude Desktop above

### For Windsurf

1. **Open Windsurf**
2. **Access MCP Settings** (check documentation for your version)
3. **Add the server configuration** using the same format

## Step 6: Restart and Test

1. **Restart your AI assistant** completely (quit and reopen)
2. **Test the integration** by asking:
   - "List the latest articles from the AI CoE"
   - "Show me all authors"
   - "What topics are covered?"
   - "Read the article about AI strategy"

## Troubleshooting

### Common Issues

#### 1. "Command not found" or "Module not found"

**Solution**: Ensure Node.js 18+ is installed and the path in your configuration is correct.

```bash
# Check Node.js version
node --version

# Should show v18.0.0 or higher
```

#### 2. "No articles found"

**Solution**: Check your internet connection and Substack URL.

```bash
# Test the feed URL manually
curl https://trilogyai.substack.com/feed
```

#### 3. "Permission denied"

**Solution**: Ensure the server file has execute permissions.

```bash
# On macOS/Linux
chmod +x dist/index.js
```

#### 4. Server won't start

**Solution**: Run in debug mode to see detailed error messages.

```bash
# Set DEBUG=true in your .env file, then test
DEBUG=true npm test
```

### Debug Mode

To enable detailed logging:

1. Edit your `.env` file:
   ```env
   DEBUG=true
   ```

2. Or set it in your AI assistant configuration:
   ```json
   {
     "mcpServers": {
       "trilogy-ai-coe": {
         "command": "node",
         "args": ["/path/to/dist/index.js"],
         "env": {
           "SUBSTACK_FEED_URL": "https://trilogyai.substack.com",
           "DEBUG": "true"
         }
       }
     }
   }
   ```

### Getting Help

If you encounter issues:

1. **Check the logs** in your AI assistant's developer console
2. **Run the test script** with debug mode enabled
3. **Verify all paths** are correct and absolute
4. **Ensure Node.js version** is 18 or higher
5. **Check internet connectivity** to Substack

## Advanced Configuration

### Custom Substack Feed

To use a different Substack feed:

1. Update the `SUBSTACK_FEED_URL` in your `.env` file
2. Rebuild the server: `npm run build`
3. Restart your AI assistant

### Development Mode

For development and testing:

```bash
# Run in watch mode (auto-rebuilds on changes)
npm run dev
```

### Production Deployment

For production use:

1. Set `DEBUG=false` in your environment
2. Consider using a process manager like PM2
3. Set up proper logging and monitoring

## Verification

After successful installation, you should be able to:

✅ Ask your AI assistant to list articles  
✅ Filter articles by author or topic  
✅ Read full article content  
✅ Browse available authors and topics  

## Next Steps

- Explore the available tools and their capabilities
- Customize the server for your specific needs
- Consider contributing improvements back to the project

## Support

For additional support:
- Check the main [README.md](./README.md)
- Review the [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)
- Open an issue on GitHub 