# AI CoE Trilogy MCP Server - Demo Recording Script

## Introduction (30 seconds)

**[Screen: Desktop with terminal ready]**

"Hi everyone! Today I'm going to show you how to create and deploy a Model Context Protocol server that connects to Substack feeds. This will allow any MCP-compatible AI assistant to access your content seamlessly."

"The MCP server we're building will connect to the AI Center of Excellence Trilogy Substack feed and provide four key capabilities: listing articles, authors, topics, and reading full article content."

## Part 1: Project Setup (2 minutes)

**[Screen: Terminal in empty directory]**

### Step 1: Initialize the Project

```bash
# Navigate to your development directory
cd ~/Documents/GitHub
mkdir Trilogy-AI-CoE-MCP
cd Trilogy-AI-CoE-MCP
```

**[Speak while typing]**
"First, let's create our project directory and initialize it."

### Step 2: Initialize Node.js Project

```bash
npm init -y
```

**[Speak]**
"We'll initialize this as a Node.js project. MCP servers can be built in various languages, but Node.js offers great tooling and libraries for this use case."

## Part 2: Dependencies and Configuration (1 minute)

**[Screen: Terminal, then code editor]**

### Step 3: Install Dependencies

```bash
npm install @modelcontextprotocol/sdk zod axios cheerio
npm install -D typescript @types/node tsx nodemon
```

**[Speak]**
"Now let's install our dependencies. We need the MCP SDK for the protocol implementation, Zod for validation, Axios for HTTP requests, and Cheerio for HTML parsing."

### Step 4: Create TypeScript Configuration

**[Screen: Create tsconfig.json]**

```bash
npx tsc --init
```

**[Speak]**
"Let's set up TypeScript for better development experience and type safety."

## Part 3: Environment Setup (1 minute)

**[Screen: Code editor]**

### Step 5: Create Environment Files

**[Create .env.example]**

```env
SUBSTACK_FEED_URL=https://aicoetrilogy.substack.com
DEBUG=false
PORT=3000
```

**[Create .env]**

```env
SUBSTACK_FEED_URL=https://aicoetrilogy.substack.com
DEBUG=true
PORT=3000
```

**[Speak]**
"We'll create environment configuration files. The .env.example serves as a template, and .env contains our actual configuration."

## Part 4: Core Server Implementation (4 minutes)

**[Screen: Code editor - create src/index.ts]**

### Step 6: Create the MCP Server

**[Speak]**
"Now for the main implementation. We'll create an MCP server that implements our four tools."

**[Show typing the main server code]**

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';

// ... (show implementation being typed)
```

**[Speak while implementing]**
"The server implements four main tools: list_articles, list_authors, list_topics, and read_article. Each tool is defined with proper schemas and handlers."

## Part 5: Package.json Scripts (30 seconds)

**[Screen: package.json]**

### Step 7: Add Build Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test-server": "echo 'Testing MCP server...' && npm run build && npm run start"
  }
}
```

**[Speak]**
"Let's add some helpful scripts for building, development, and testing."

## Part 6: Testing the Server (1 minute)

**[Screen: Terminal]**

### Step 8: Build and Test

```bash
npm run build
npm run test-server
```

**[Speak]**
"Let's build our server and test that it starts correctly. You should see the server initialize and list the available tools."

## Part 7: Claude Desktop Integration (2 minutes)

**[Screen: Claude Desktop settings]**

### Step 9: Configure Claude Desktop

**[Navigate to settings]**

"Now let's integrate our server with Claude Desktop. We'll go to the Developer settings and add our MCP server configuration."

**[Show configuration]**

```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/Users/yourname/Documents/GitHub/Trilogy-AI-CoE-MCP/dist/index.js"],
      "env": {
        "SUBSTACK_FEED_URL": "https://aicoetrilogy.substack.com"
      }
    }
  }
}
```

**[Speak]**
"We configure the server with the full path to our built JavaScript file and pass the Substack feed URL as an environment variable."

### Step 10: Restart Claude Desktop

**[Show restarting Claude]**

"After saving the configuration, we need to restart Claude Desktop for the changes to take effect."

## Part 8: Live Demo (2 minutes)

**[Screen: Claude Desktop chat interface]**

### Step 11: Test the Tools

**[Show typing in Claude]**

"Let's test our MCP server with some real queries:"

1. "List the latest articles from the AI CoE Trilogy"
2. "Show me all the authors who have written articles"
3. "What topics are covered in the articles?"
4. "Read me the most recent article about AI strategy"

**[Speak]**
"As you can see, Claude can now access our Substack feed through the MCP server, providing seamless integration with our content."

## Part 9: Universal Compatibility (1 minute)

**[Screen: Cursor/Windsurf settings]**

### Step 12: Show Other Integrations

**[Speak]**
"The beauty of MCP is its universal compatibility. Let's quickly show how the same server works with Cursor."

**[Show adding the same configuration to Cursor]**

"The exact same configuration works across different AI assistants. No need to rebuild for each platform."

## Conclusion (30 seconds)

**[Screen: Summary slide or terminal]**

"That's it! We've successfully created an MCP server that connects to Substack feeds and demonstrated its universal compatibility across AI assistants. The server provides a clean API for accessing articles, authors, and topics."

"Key benefits:"
- Universal compatibility across AI platforms
- Clean, standardized API
- Easy to extend with additional features
- Secure and scalable architecture

"The complete code is available in the repository. Thanks for watching!"

## Total Time: ~10 minutes

---

## Pre-Recording Checklist

- [ ] Ensure all dependencies are installed
- [ ] Test the server locally
- [ ] Verify Claude Desktop configuration
- [ ] Prepare sample Substack content
- [ ] Clear terminal history
- [ ] Set up screen recording
- [ ] Test audio levels
- [ ] Prepare backup configurations

## Post-Recording Tasks

- [ ] Edit video for clarity
- [ ] Add captions/subtitles
- [ ] Create accompanying blog post
- [ ] Upload to desired platform
- [ ] Share repository link 