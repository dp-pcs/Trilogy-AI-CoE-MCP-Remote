# Universal MCP Demo Script 🎬

**Goal**: Demonstrate "One Server, Multiple AI Clients" - the power of universal MCP compatibility

**Duration**: ~10-12 minutes

**Key Message**: Write once, use everywhere with MCP! (Plus transparency about current adoption state)

---

## 🖥️ Screen Setup Tips

**Primary Screen**: Your main presentation screen
**Secondary Screen**: This script (keep it open for reference)

**Applications to have ready**:
- Terminal (clean, large font)
- Claude Desktop (closed initially)
- Cursor (closed initially)
- Web browser (for GitHub)

---

## Part 1: Introduction & Setup (3 minutes)

### 🎯 Opening Hook (30 seconds)
**[Screen: Desktop with terminal ready]**

**SAY**: 
> "Today I'm going to show you something powerful about the Model Context Protocol. We're going to take ONE server and connect it to multiple AI assistants - Claude, Cursor, and - once I can figure it out, ChatGPT - that one has been a bit of a pain as they're beta support for MCP is very beta and I'm getting errors when I try and configure it, which I'll show for the sake of transparency, but in the end you should get an idea of why MCP is turning into a game changer in the name of universal connectivity. This demonstrates MCP's core promise: write once, use everywhere."

### 📂 Clone the Repository (1 minute)
**[Screen: Terminal, large font, clean background]**

**SAY**: "Let's start by cloning our universal MCP server repository."

**TYPE**:
```bash
cd ~/Desktop
git clone https://github.com/dp-pcs/Trilogy-AI-CoE-MCP-Remote.git
cd Trilogy-AI-CoE-MCP-Remote
```

**SAY**: "This repository contains a single MCP server that can work with multiple AI clients using different protocols."

### 📋 Show Repository Structure (30 seconds)
**[Screen: Terminal]**

**TYPE**:
```bash
ls -la
```

**SAY**: "Notice we have the main server code, a client script for Claude/Cursor, and clear documentation. The key file is `mcp-remote-client.js` - this bridges our remote server to local AI assistants."

### 🔧 Install Dependencies (1 minute)
**[Screen: Terminal]**

**SAY**: "Let's install the dependencies. We need Node.js and the MCP SDK."

**TYPE**:
```bash
npm install
```

**SAY**: "While this installs, let me explain the architecture. We have one remote server running in the cloud, and we're creating local clients that connect to it. This means users don't need to run the server locally."

---

## Part 2: Claude Desktop Integration (2.5 minutes)

### 📍 Locate Client Script (30 seconds)
**[Screen: Terminal]**

**SAY**: "First, let's set up Claude Desktop. We need the full path to our client script."

**TYPE**:
```bash
pwd
echo "$(pwd)/mcp-remote-client.js"
```

**SAY**: "Copy this path - we'll need it for the configuration."

### ⚙️ Configure Claude Desktop (1 minute)
**[Screen: Finder/File Explorer]**

**SAY**: "Now let's configure Claude Desktop. I need to edit the MCP configuration file."

**Navigate to**: `~/.config/claude_desktop_config.json`

**SAY**: "If this file doesn't exist, I'll create it."

**SHOW TYPING** (in text editor):
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/Users/yourname/Desktop/Trilogy-AI-CoE-MCP-Remote/mcp-remote-client.js"]
    }
  }
}
```

**SAY**: "Notice how simple this is - just point to our client script. The client handles all the communication with the remote server."

### 🚀 Test Claude Desktop (1 minute)
**[Screen: Claude Desktop]**

**SAY**: "Let's restart Claude Desktop and test it."

**ACTION**: Restart Claude Desktop

**SAY**: "Now I'll test our MCP server with a query."

**TYPE IN CLAUDE**:
```
Search for articles about agentic frameworks
```

**SAY**: "Perfect! Claude is now connected to our Trilogy AI CoE content through the MCP server. Notice how it found relevant articles about agentic frameworks."

---

## Part 3: Cursor Integration (2 minutes)

### ⚙️ Configure Cursor (1 minute)
**[Screen: Cursor Settings]**

**SAY**: "Now here's the beautiful part - the exact same configuration works in Cursor. This is the power of MCP standards."

**ACTION**: Open Cursor → Settings → Search for "MCP"

**SHOW ADDING** the same configuration:
```json
{
  "mcpServers": {
    "trilogy-ai-coe": {
      "command": "node",
      "args": ["/Users/yourname/Desktop/Trilogy-AI-CoE-MCP-Remote/mcp-remote-client.js"]
    }
  }
}
```

**SAY**: "Identical configuration. No changes needed. This is what universal compatibility looks like."

### 🚀 Test Cursor (1 minute)
**[Screen: Cursor]**

**SAY**: "Let's restart Cursor and test the same functionality."

**ACTION**: Restart Cursor

**TYPE IN CURSOR**:
```
Show me the 5 most recent articles from the AI CoE
```

**SAY**: "Excellent! The same server, the same tools, working perfectly in Cursor. One server, multiple clients - that's the MCP promise delivered."

---

## Part 4: ChatGPT Connector (Transparency Demo) (2 minutes)

### 🚧 ChatGPT MCP Setup (1.5 minutes)
**[Screen: Browser - chatgpt.com]**

**SAY**: "Now let's be transparent about the current state of MCP adoption. ChatGPT has beta support for MCP connectors, but as you'll see, it's still quite beta."

**ACTION**: Navigate to ChatGPT Settings

**SAY**: "In theory, this should work beautifully. Let me show you how you would set it up."

**NAVIGATE**: ChatGPT → Settings → Beta Features → Connectors (or wherever MCP settings are)

**SAY**: "Here's where you would add our MCP server. The configuration should be:"

**SHOW** (even if it doesn't work):
- **Name**: `Trilogy AI CoE MCP Server`
- **URL**: `https://ai-coe-mcp.latentgenius.ai/mcp`
- **Authentication**: `No authentication`

**SAY**: "This is the same server we just used successfully with Claude and Cursor. The server is working perfectly - it's just that ChatGPT's MCP implementation is still in early beta."

### 🔍 Show the Working Server (30 seconds)
**[Screen: Browser - new tab]**

**SAY**: "Let me prove the server works by testing it directly."

**NAVIGATE TO**: `https://ai-coe-mcp.latentgenius.ai/health`

**SAY**: "See? The server is healthy and running."

**NAVIGATE TO**: `https://ai-coe-mcp.latentgenius.ai/tools`

**SAY**: "And here are the tools that ChatGPT should be able to access once their MCP support matures. Same tools, same server that worked perfectly with Claude and Cursor."

**SAY**: "This actually demonstrates something important about MCP - when ChatGPT's implementation is ready, our server will work immediately. No changes needed on our end. That's the power of open standards."

---

## Part 5: Architecture Explanation (1.5 minutes)

### 🏗️ Show the Architecture (1 minute)
**[Screen: Terminal or draw on screen]**

**SAY**: "Let me show you what's happening under the hood."

**DRAW/SHOW**:
```
    Remote Server (Cloud)
    ai-coe-mcp.latentgenius.ai
            │
            │ HTTP/HTTPS
            │
    ┌───────┼───────┐
    │               │
    ▼               ▼
Claude Client    Cursor Client
(stdio MCP)     (stdio MCP)
```

**SAY**: "Both Claude and Cursor use the stdio MCP protocol locally, but our client script translates that to HTTP calls to the remote server. This gives us the best of both worlds - local MCP compatibility with remote server convenience."

### 🌐 Bonus: ChatGPT Compatibility (30 seconds)
**[Screen: Browser or mention]**

**SAY**: "And here's the bonus - this same server also works with ChatGPT's Deep Research feature using a different endpoint. One server, three different AI assistants, each using their preferred integration method."

---

## Part 6: Key Takeaways (1 minute)

### ✨ Wrap Up (1 minute)
**[Screen: Terminal or summary slide]**

**SAY**: 
> "What we've just demonstrated is the true power of the Model Context Protocol:
> 
> ✅ **Universal Compatibility** - One server works with multiple AI assistants
> ✅ **Standard Protocols** - Each client uses their preferred integration method  
> ✅ **Developer Efficiency** - Write tools once, use everywhere
> ✅ **User Choice** - Users can switch between AI assistants without losing functionality
> ✅ **Future-Proof** - When new AI assistants add MCP support, our tools work immediately
> 
> We saw this working perfectly with Claude and Cursor, and we saw that ChatGPT is almost there. This is why MCP is revolutionary - it creates a universal ecosystem where AI tools work across platforms, not just within silos."

**FINAL SAY**: "The complete code is available in the repository. This is the future of AI tool integration - universal, standard, and powerful."

---

## 🎬 Presentation Tips

### **Screen Sharing Best Practices**:
- **Large fonts** in terminal (18pt+)
- **Clean desktop** background
- **Close unnecessary apps**
- **Use full screen** for each application
- **Slow, deliberate typing** so viewers can follow

### **Timing Tips**:
- **Pause after each major step** to let it sink in
- **Explain while things are loading** (npm install, app restarts)
- **Show the results clearly** before moving on
- **Emphasize the "same configuration" moment** in Cursor

### **Key Phrases to Emphasize**:
- "Write once, use everywhere"
- "Universal compatibility"
- "Same configuration works in both"
- "One server, multiple clients"
- "This is the power of open standards"

### **If Something Goes Wrong**:
- **Have the live server ready**: `https://ai-coe-mcp.latentgenius.ai`
- **Test queries beforehand**: "agentic frameworks", "recent articles"
- **Backup plan**: Show the HTTP endpoints working directly

### **Demo Queries That Work Well**:
1. `Search for articles about agentic frameworks`
2. `Show me the 5 most recent articles`
3. `Find articles by David Proctor`
4. `What topics are covered in the AI CoE content?`

---

## 🚨 Pre-Demo Checklist

- [ ] Repository cloned and tested locally
- [ ] Node.js installed and working
- [ ] Claude Desktop available and working
- [ ] Cursor installed and working
- [ ] Internet connection stable
- [ ] Screen recording setup (if needed)
- [ ] This script open on secondary screen
- [ ] Terminal font size increased
- [ ] Desktop cleaned up
- [ ] Test the demo flow once before presenting

**Break a leg! 🎭** 