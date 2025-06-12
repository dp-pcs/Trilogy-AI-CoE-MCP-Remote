# ChatGPT Deep Research Connector Setup Guide

## 🎯 Complete Configuration for ChatGPT MCP Connector

Follow this guide to set up the Trilogy AI CoE MCP Server as a Deep Research connector in ChatGPT.

## Step 1: Access ChatGPT Connector Settings

1. Go to **ChatGPT Settings** → **Connectors**
2. Click **"Add Connector"** or **"Create Custom Connector"**
3. Select **"MCP Server"** as the connector type

## Step 2: Basic Configuration

Fill in these exact values:

### **Connector Name**
```
Trilogy AI CoE MCP Server
```

### **Connector Description**
```
Access to Trilogy AI Center of Excellence articles and insights for enterprise AI strategy, implementation, and thought leadership
```

### **MCP Server URL**
```
https://ai-coe-mcp.latentgenius.ai/mcp
```

### **Authentication**
```
No authentication
```

## Step 3: Detailed Usage Instructions

**Copy and paste this entire block into the "Usage Instructions" or "Description" field:**

```
TRILOGY AI CENTER OF EXCELLENCE MCP SERVER

This connector provides access to articles, insights, and research from Trilogy's AI Center of Excellence Substack publication (https://trilogyai.substack.com).

AVAILABLE TOOLS:
• search - Find articles by keywords, topics, or authors
• fetch - Retrieve full article content by ID for detailed analysis

CONTENT EXPERTISE AREAS:
• Enterprise AI strategy and implementation
• Agentic AI frameworks and automation
• Machine learning best practices
• Data science methodologies
• AI transformation case studies
• Technical leadership insights
• Industry analysis and trends

SEARCH CAPABILITIES:
• Topic-based: "agentic frameworks", "AI strategy", "machine learning", "automation"
• Author-based: "David Proctor", "Trilogy team"
• Concept-based: "implementation", "best practices", "enterprise AI", "transformation"
• Technology-based: "LLMs", "neural networks", "data pipelines", "MLOps"

OPTIMAL SEARCH STRATEGIES:
1. Use specific technical terms for targeted results
2. Combine multiple keywords for refined searches (e.g., "agentic AI enterprise")
3. Search for author names to find their specific perspectives
4. Use broad terms like "AI strategy" for comprehensive overviews
5. Include industry context like "enterprise", "business", "implementation"

RESEARCH WORKFLOW:
1. Start with broad searches to understand available content scope
2. Use specific keywords to drill down into topics of interest
3. Fetch full articles for detailed analysis and proper citations
4. Cross-reference multiple articles for comprehensive insights
5. Look for author-specific perspectives on key topics

EXAMPLE EFFECTIVE QUERIES:
• "Search for articles about agentic AI frameworks and automation"
• "Find David Proctor's insights on enterprise AI implementation strategies"
• "Look for content on machine learning best practices in business"
• "Research Trilogy's perspective on AI transformation methodologies"
• "Find case studies on successful AI adoption in enterprises"
• "Search for technical leadership insights on data science"

CONTENT AUTHORITY:
• Source: Trilogy AI Center of Excellence team
• Focus: Enterprise-grade AI strategy and implementation
• Perspective: Technical leadership and practical application
• Update frequency: Real-time access to latest published insights
• Content depth: Strategic frameworks, technical guides, case studies

USE THIS CONNECTOR WHEN:
• Researching enterprise AI implementation strategies
• Looking for technical leadership perspectives on AI
• Seeking practical frameworks for AI adoption
• Analyzing AI transformation case studies
• Understanding agentic AI and automation approaches
• Finding expert insights on machine learning in business contexts

CITATION FORMAT:
All content includes proper URLs for citation and further reading. Always reference the original Trilogy AI CoE articles when using insights.
```

## Step 4: Advanced Configuration (Optional)

If your ChatGPT interface provides additional configuration options:

### **Rate Limiting**
- Leave at default settings (the server handles its own rate limiting)

### **Timeout Settings**
- Connection timeout: 30 seconds
- Read timeout: 60 seconds

### **Headers** (if configurable)
- Content-Type: application/json
- Accept: application/json

## Step 5: Test the Connector

After saving the configuration, test with these queries:

### **Basic Functionality Test**
```
"Test the Trilogy AI CoE connector by searching for articles about AI strategy"
```

### **Specific Topic Test**
```
"Use the Trilogy connector to research agentic AI frameworks"
```

### **Author-Specific Test**
```
"Find David Proctor's insights on enterprise AI implementation using the Trilogy connector"
```

### **Deep Research Test**
```
"Perform deep research on AI transformation strategies using insights from Trilogy's AI Center of Excellence"
```

## Step 6: Verify Successful Integration

You should see:

1. ✅ **Connector Status**: "Connected" or "Active"
2. ✅ **Tool Discovery**: ChatGPT recognizes `search` and `fetch` tools
3. ✅ **Search Results**: Returns relevant articles with titles, summaries, and URLs
4. ✅ **Content Fetching**: Can retrieve full article content when needed
5. ✅ **Proper Citations**: Includes source URLs for all content

## Troubleshooting

### **Common Issues and Solutions**

#### **"Connector not responding"**
- Verify the URL is exactly: `https://ai-coe-mcp.latentgenius.ai/mcp`
- Check that you're using HTTPS (not HTTP)
- Test the server directly: [https://ai-coe-mcp.latentgenius.ai/health](https://ai-coe-mcp.latentgenius.ai/health)

#### **"No search results found"**
- Try broader search terms initially
- Use specific technical terms from the content areas listed above
- Check spelling of search queries

#### **"Tools not available"**
- Ensure the MCP Server URL ends with `/mcp`
- Verify the connector is properly saved and activated
- Try disconnecting and reconnecting the connector

#### **"Authentication errors"**
- Confirm "No authentication" is selected
- Do not add any API keys or tokens

### **Testing Server Availability**

You can manually test the server:

```bash
# Test server health
curl https://ai-coe-mcp.latentgenius.ai/health

# Test MCP endpoint
curl -X POST https://ai-coe-mcp.latentgenius.ai/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

## Best Practices for Usage

### **Effective Research Patterns**

1. **Start Broad, Then Narrow**
   - Begin with general topics like "AI strategy"
   - Refine with specific terms like "agentic AI enterprise implementation"

2. **Leverage Author Expertise**
   - Search for "David Proctor" to find leadership perspectives
   - Look for "Trilogy team" insights on specific technologies

3. **Combine Multiple Searches**
   - Use different keyword combinations to get comprehensive coverage
   - Cross-reference findings across multiple articles

4. **Use Full Content When Needed**
   - Fetch complete articles for detailed analysis
   - Always include proper citations from the provided URLs

### **Content Categories to Explore**

- **Strategic Frameworks**: AI adoption strategies, transformation roadmaps
- **Technical Implementation**: Practical guides, best practices, methodologies
- **Industry Analysis**: Market trends, technology assessments, future predictions
- **Case Studies**: Real-world applications, success stories, lessons learned
- **Thought Leadership**: Expert opinions, innovative approaches, emerging concepts

## Support and Updates

- **Server Status**: Monitor at [https://ai-coe-mcp.latentgenius.ai/health](https://ai-coe-mcp.latentgenius.ai/health)
- **Content Source**: [https://trilogyai.substack.com](https://trilogyai.substack.com)
- **Technical Issues**: Check the GitHub repository for updates and support

## Publishing to Workspace (Enterprise/Edu/Team)

If you're an admin and want to publish this connector to your entire workspace:

1. Complete the setup above
2. Test thoroughly with your team
3. Go to **Workspace Settings** → **Connectors**
4. Select your configured Trilogy AI CoE connector
5. Click **"Publish to Workspace"**
6. Add a workspace description explaining the value to your team

### **Workspace Description Template**
```
Access to Trilogy AI Center of Excellence insights for enterprise AI strategy and implementation. This connector provides our team with expert perspectives on agentic AI, machine learning best practices, and AI transformation strategies from industry leaders.
```

---

**Ready to start researching with Trilogy's AI expertise!** 🚀 