// Load polyfill for ReadableStream compatibility
import './polyfill.js';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';
import express from 'express';
import cors from 'cors';

// Check if fetch is available, import node-fetch as fallback
let fetchFunction: typeof fetch;
if (typeof fetch !== 'undefined') {
  fetchFunction = fetch;
  console.log('Using built-in fetch');
} else {
  console.log('Built-in fetch not available, trying to import node-fetch');
  try {
    const nodeFetch = await import('node-fetch');
    fetchFunction = nodeFetch.default as any;
    console.log('Using node-fetch fallback');
  } catch (error) {
    console.error('Failed to import node-fetch:', error);
    throw new Error('No fetch implementation available');
  }
}

// Environment configuration
const SUBSTACK_FEED_URL = process.env.SUBSTACK_FEED_URL || 'https://trilogyai.substack.com';
const DEBUG = process.env.DEBUG === 'true';
const PORT = process.env.PORT || 3000;
const MODE = process.env.MODE || 'http'; // 'stdio' for local MCP, 'http' for remote server

// Types for our data structures
interface Article {
  id: string;
  title: string;
  author: string;
  publishedDate: string;
  url: string;
  excerpt: string;
  topics: string[];
}

interface Author {
  name: string;
  articleCount: number;
  latestArticle: string;
}

interface Topic {
  name: string;
  articleCount: number;
  articles: string[];
}

// In-memory cache for articles (in production, you might use Redis or a database)
let articlesCache: Article[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Utility function for debug logging
function debugLog(message: string, data?: any) {
  if (DEBUG) {
    console.error(`[DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Function to fetch and parse Substack feed
async function fetchSubstackFeed(): Promise<Article[]> {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (articlesCache.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    debugLog('Returning cached articles');
    return articlesCache;
  }

  try {
    debugLog(`Fetching Substack feed from: ${SUBSTACK_FEED_URL}`);
    
    // Try RSS feed first
    const rssUrl = `${SUBSTACK_FEED_URL}/feed`;
    const response = await axios.get(rssUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MCP-Server/1.0)',
      },
    });

    const $ = cheerio.load(response.data, { xmlMode: true });
    const articles: Article[] = [];

    $('item').each((index, element) => {
      const $item = $(element);
      const title = $item.find('title').text().trim();
      const link = $item.find('link').text().trim();
      const pubDate = $item.find('pubDate').text().trim();
      const description = $item.find('description').text().trim();
      const author = $item.find('dc\\:creator, creator').text().trim() || 'Unknown Author';

      // Extract topics from categories or generate from title
      const categories: string[] = [];
      $item.find('category').each((_, cat) => {
        categories.push($(cat).text().trim());
      });

      // If no categories, try to extract topics from title/description
      const topics = categories.length > 0 ? categories : extractTopicsFromText(title + ' ' + description);

      if (title && link) {
        articles.push({
          id: `article-${index + 1}`,
          title,
          author,
          publishedDate: pubDate,
          url: link,
          excerpt: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
          topics,
        });
      }
    });

    articlesCache = articles;
    lastFetchTime = now;
    debugLog(`Fetched ${articles.length} articles from Substack`);
    
    return articles;
  } catch (error) {
    debugLog('Error fetching Substack feed', error);
    
    // Return mock data if feed is unavailable
    const mockArticles: Article[] = [
      {
        id: 'mock-1',
        title: 'Getting Started with AI Center of Excellence',
        author: 'AI CoE Team',
        publishedDate: new Date().toISOString(),
        url: `${SUBSTACK_FEED_URL}/p/getting-started-with-ai-coe`,
        excerpt: 'Learn how to establish and run an effective AI Center of Excellence in your organization...',
        topics: ['AI Strategy', 'Organization', 'Getting Started'],
      },
      {
        id: 'mock-2',
        title: 'Best Practices for AI Governance',
        author: 'Dr. Sarah Johnson',
        publishedDate: new Date(Date.now() - 86400000).toISOString(),
        url: `${SUBSTACK_FEED_URL}/p/ai-governance-best-practices`,
        excerpt: 'Implementing robust AI governance frameworks to ensure responsible AI deployment...',
        topics: ['AI Governance', 'Ethics', 'Compliance'],
      },
      {
        id: 'mock-3',
        title: 'Measuring ROI of AI Initiatives',
        author: 'Michael Chen',
        publishedDate: new Date(Date.now() - 172800000).toISOString(),
        url: `${SUBSTACK_FEED_URL}/p/measuring-ai-roi`,
        excerpt: 'Key metrics and methodologies for tracking the return on investment of AI projects...',
        topics: ['ROI', 'Metrics', 'Business Value'],
      },
    ];

    articlesCache = mockArticles;
    lastFetchTime = now;
    return mockArticles;
  }
}

// Function to extract topics from text using simple keyword matching
function extractTopicsFromText(text: string): string[] {
  const topicKeywords = {
    'AI Strategy': ['strategy', 'strategic', 'planning', 'roadmap'],
    'Machine Learning': ['machine learning', 'ml', 'model', 'algorithm'],
    'Data Science': ['data science', 'analytics', 'insights', 'data'],
    'AI Governance': ['governance', 'ethics', 'responsible', 'compliance'],
    'Technology': ['technology', 'tech', 'platform', 'infrastructure'],
    'Business Value': ['roi', 'value', 'business', 'impact', 'benefit'],
    'Innovation': ['innovation', 'innovative', 'breakthrough', 'cutting-edge'],
    'Leadership': ['leadership', 'management', 'executive', 'ceo'],
  };

  const lowerText = text.toLowerCase();
  const foundTopics: string[] = [];

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      foundTopics.push(topic);
    }
  }

  return foundTopics.length > 0 ? foundTopics : ['General'];
}

// Function to fetch full article content
async function fetchArticleContent(url: string): Promise<string> {
  try {
    debugLog(`Fetching article content from: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MCP-Server/1.0)',
      },
    });

    const $ = cheerio.load(response.data);
    
    // Try different selectors for Substack content
    let content = '';
    const contentSelectors = [
      '.markup',
      '.post-content',
      'article',
      '.available-content',
      'main',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length > 0) {
        content = element.text().trim();
        if (content.length > 100) { // Ensure we got substantial content
          break;
        }
      }
    }

    if (!content) {
      // Fallback: get all paragraph text
      content = $('p').map((_, el) => $(el).text()).get().join('\n\n');
    }

    return content || 'Content could not be extracted from this article.';
  } catch (error) {
    debugLog('Error fetching article content', error);
    return 'Unable to fetch article content. Please visit the URL directly.';
  }
}

// MCP Server setup
const server = new Server(
  {
    name: 'trilogy-ai-coe-mcp-remote',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions for ChatGPT Deep Research compatibility
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search',
        description: 'Searches for Trilogy AI Center of Excellence articles and returns matching resource IDs.\n\nPurpose:\n1. Search through Trilogy AI CoE Substack articles by keywords, topics, authors, or concepts\n2. Returns only IDs - use the fetch tool to get full content for specific articles\n3. Supports both broad topic searches and specific technical queries\n\nUsage:\n1. Use specific technical terms for targeted results (e.g., "agentic frameworks", "machine learning", "enterprise AI")\n2. Search by author names to find their specific content (e.g., "David Proctor")\n3. Combine multiple keywords for refined searches (e.g., "AI strategy implementation")\n4. Use broad terms for comprehensive overviews (e.g., "artificial intelligence", "automation")\n5. Search for industry concepts (e.g., "transformation", "best practices", "case studies")\n\nQuery Formation:\n• Single keywords: "AI", "automation", "strategy"\n• Multiple keywords: "agentic AI frameworks", "enterprise machine learning"\n• Author searches: "David Proctor insights", "Trilogy team"\n• Topic combinations: "AI implementation best practices"\n• Technical terms: "LLMs", "neural networks", "data science", "MLOps"\n\nContent Areas Available:\n• Enterprise AI strategy and implementation\n• Agentic AI frameworks and automation\n• Machine learning best practices\n• Data science methodologies\n• AI transformation case studies\n• Technical leadership insights\n• Industry analysis and trends\n\nExamples:\n• "agentic frameworks" → finds articles about agentic AI systems\n• "David Proctor enterprise AI" → finds David\'s articles on enterprise AI\n• "machine learning best practices" → finds ML methodology articles\n• "AI transformation case studies" → finds implementation examples\n• "automation strategy" → finds articles on automation approaches',
        input_schema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for Trilogy AI CoE articles. Use specific technical terms, author names, or topic combinations for best results.'
            }
          },
          required: ['query']
        },
        output_schema: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the resource.'
                  },
                  title: {
                    type: 'string',
                    description: 'Title or headline of the resource.'
                  },
                  text: {
                    type: 'string',
                    description: 'Text snippet or summary from the resource.'
                  },
                  url: {
                    type: ['string', 'null'],
                    description: 'URL of the resource. Optional but needed for citations to work.'
                  }
                },
                required: ['id', 'title', 'text']
              }
            }
          },
          required: ['results']
        }
      },
      {
        name: 'fetch',
        description: 'Retrieves detailed content for a specific resource identified by the given ID.\n\nPurpose:\n1. Get complete article content including full text, metadata, and citations\n2. Use after search to get detailed information about specific articles\n3. Provides structured data with title, content, URL, and metadata\n\nUsage:\n1. Always use this tool after search to get full article content\n2. The ID must be from a search result\n3. Returns complete article text for analysis and citation\n4. Includes author, publication date, and source URL for proper attribution\n\nResponse Format:\n• id: Unique identifier for the article\n• title: Full article headline\n• text: Complete article content (up to 2000 characters)\n• url: Source URL for citations and further reading\n• metadata: Author, publication date, and excerpt information',
        input_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the resource to fetch (must be from search results).'
            }
          },
          required: ['id']
        },
        output_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the resource.'
            },
            title: {
              type: 'string',
              description: 'Title or headline of the fetched resource.'
            },
            text: {
              type: 'string',
              description: 'Complete textual content of the resource.'
            },
            url: {
              type: ['string', 'null'],
              description: 'URL of the resource. Optional but needed for citations to work.'
            },
            metadata: {
              type: ['object', 'null'],
              additionalProperties: {
                type: 'string'
              },
              description: 'Optional metadata providing additional context.'
            }
          },
          required: ['id', 'title', 'text']
        }
      }
    ],
  };
});

// Search tool implementation
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'search') {
    try {
      const { query } = args as { query: string };
      
      // Fetch articles from Substack
        const articles = await fetchSubstackFeed();
        
      // Search through articles
      const searchTerms = query.toLowerCase().split(' ');
      const results = articles
        .filter(article => {
          const searchText = `${article.title} ${article.excerpt || ''} ${article.author || ''}`.toLowerCase();
          return searchTerms.some((term: string) => searchText.includes(term));
        })
        .slice(0, 10) // Limit to 10 results
        .map(article => ({
          id: article.id,
          title: article.title,
          text: article.excerpt || article.title,
          url: article.url
        }));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ results })
          }
        ]
      };
    } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
              error: 'Failed to search articles',
              message: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        ],
        isError: true
        };
      }
  }

  if (name === 'fetch') {
    try {
      const { id } = args as { id: string };
      
      // Fetch articles from Substack
        const articles = await fetchSubstackFeed();
        
      // Find the specific article
      const article = articles.find(a => a.id === id);
      
      if (!article) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Article not found' })
            }
          ],
          isError: true
        };
      }

      // Fetch full article content if available
      let fullText = article.excerpt || '';
      
      if (article.url) {
        try {
          const articleUrl = article.url;
          const response = await fetchFunction(articleUrl);
          const html = await response.text();
          
          // Basic HTML parsing to extract text content
          const textContent = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
          
          if (textContent.length > 500) {
            fullText = textContent.substring(0, 2000) + '...';
          }
        } catch (fetchError) {
          // If we can't fetch full content, use what we have
          console.error('Failed to fetch full article content:', fetchError);
        }
      }

      const result = {
        id: article.id,
        title: article.title,
        text: fullText || article.title,
        url: article.url,
        metadata: {
          author: article.author || 'Unknown',
          published_date: article.publishedDate || '',
          excerpt: article.excerpt || ''
        }
      };
        
        return {
          content: [
            {
              type: 'text',
            text: JSON.stringify(result)
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ 
              error: 'Failed to fetch article',
              message: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        ],
        isError: true
      };
    }
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Create Express app for HTTP mode
const app = express();

// Enhanced CORS configuration for ChatGPT and other MCP clients
app.use(cors({
  origin: true, // Allow all origins for MCP compatibility
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: false,
  maxAge: 86400 // Cache preflight for 24 hours
}));

app.use(express.json());

// Additional headers for browser compatibility
app.use((req, res, next) => {
  // Ensure CORS headers are always present
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Max-Age', '86400');
  
  // Security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send();
    return;
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// MCP tools endpoint
app.get('/tools', async (req, res) => {
  try {
    const tools = [
      {
        name: 'search',
        description: 'Searches for Trilogy AI Center of Excellence articles and returns matching resource IDs.\n\nPurpose:\n1. Search through Trilogy AI CoE Substack articles by keywords, topics, authors, or concepts\n2. Returns only IDs - use the fetch tool to get full content for specific articles\n3. Supports both broad topic searches and specific technical queries\n\nUsage:\n1. Use specific technical terms for targeted results (e.g., "agentic frameworks", "machine learning", "enterprise AI")\n2. Search by author names to find their specific content (e.g., "David Proctor")\n3. Combine multiple keywords for refined searches (e.g., "AI strategy implementation")\n4. Use broad terms for comprehensive overviews (e.g., "artificial intelligence", "automation")\n5. Search for industry concepts (e.g., "transformation", "best practices", "case studies")\n\nQuery Formation:\n• Single keywords: "AI", "automation", "strategy"\n• Multiple keywords: "agentic AI frameworks", "enterprise machine learning"\n• Author searches: "David Proctor insights", "Trilogy team"\n• Topic combinations: "AI implementation best practices"\n• Technical terms: "LLMs", "neural networks", "data science", "MLOps"\n\nContent Areas Available:\n• Enterprise AI strategy and implementation\n• Agentic AI frameworks and automation\n• Machine learning best practices\n• Data science methodologies\n• AI transformation case studies\n• Technical leadership insights\n• Industry analysis and trends\n\nExamples:\n• "agentic frameworks" → finds articles about agentic AI systems\n• "David Proctor enterprise AI" → finds David\'s articles on enterprise AI\n• "machine learning best practices" → finds ML methodology articles\n• "AI transformation case studies" → finds implementation examples\n• "automation strategy" → finds articles on automation approaches',
        input_schema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for Trilogy AI CoE articles. Use specific technical terms, author names, or topic combinations for best results.'
            }
          },
          required: ['query']
        },
        output_schema: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the resource.'
                  },
                  title: {
                    type: 'string',
                    description: 'Title or headline of the resource.'
                  },
                  text: {
                    type: 'string',
                    description: 'Text snippet or summary from the resource.'
                  },
                  url: {
                    type: ['string', 'null'],
                    description: 'URL of the resource. Optional but needed for citations to work.'
                  }
                },
                required: ['id', 'title', 'text']
              }
            }
          },
          required: ['results']
        }
      },
      {
        name: 'fetch',
        description: 'Retrieves detailed content for a specific resource identified by the given ID.',
        input_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the resource to fetch.'
            }
          },
          required: ['id']
        },
        output_schema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID of the resource.'
            },
            title: {
              type: 'string',
              description: 'Title or headline of the fetched resource.'
            },
            text: {
              type: 'string',
              description: 'Complete textual content of the resource.'
            },
            url: {
              type: ['string', 'null'],
              description: 'URL of the resource. Optional but needed for citations to work.'
            },
            metadata: {
              type: ['object', 'null'],
              additionalProperties: {
                type: 'string'
              },
              description: 'Optional metadata providing additional context.'
            }
          },
          required: ['id', 'title', 'text']
        }
      }
    ];
    
    res.json({ tools });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tools' });
  }
});

// Execute tool endpoint
app.post('/tools/:toolName', async (req, res) => {
  const { toolName } = req.params;
  const args = req.body;

  try {
    let result;
    
    switch (toolName) {
      case 'search': {
        const { query } = args;
        const articles = await fetchSubstackFeed();
        
        // Search through articles
        const searchTerms = query.toLowerCase().split(' ');
        const results = articles
          .filter(article => {
            const searchText = `${article.title} ${article.excerpt || ''} ${article.author || ''}`.toLowerCase();
            return searchTerms.some((term: string) => searchText.includes(term));
          })
          .slice(0, 10) // Limit to 10 results
          .map(article => ({
            id: article.id,
            title: article.title,
            text: article.excerpt || article.title,
            url: article.url
          }));

        result = { results };
        break;
      }

      case 'fetch': {
        const { id } = args;
        const articles = await fetchSubstackFeed();
        
        // Find the specific article
        const article = articles.find(a => a.id === id);
        
        if (!article) {
          return res.status(404).json({ error: 'Article not found' });
        }

        // Fetch full article content if available
        let fullText = article.excerpt || '';
        
        if (article.url) {
          try {
            const articleUrl = article.url;
            const response = await fetchFunction(articleUrl);
            const html = await response.text();
            
            // Basic HTML parsing to extract text content
            const textContent = html
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            if (textContent.length > 500) {
              fullText = textContent.substring(0, 2000) + '...';
            }
          } catch (fetchError) {
            // If we can't fetch full content, use what we have
            console.error('Failed to fetch full article content:', fetchError);
          }
        }

        const articleResult = {
          id: article.id,
          title: article.title,
          text: fullText || article.title,
          url: article.url,
          metadata: {
            author: article.author || 'Unknown',
            published_date: article.publishedDate || '',
            excerpt: article.excerpt || ''
          }
        };

        result = articleResult;
        break;
      }

      default:
        return res.status(404).json({ error: `Unknown tool: ${toolName}` });
    }
    
    res.json(result);
  } catch (error) {
    debugLog('Tool execution error', error);
    res.status(500).json({ 
      error: `Error executing tool ${toolName}: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
});

// Root endpoint with server info
app.get('/', (req, res) => {
  res.json({
    name: 'Trilogy AI CoE MCP Remote Server',
    version: '1.0.0',
    description: 'A remote Model Context Protocol server for Trilogy AI Center of Excellence Substack content',
    endpoints: {
      health: '/health',
      tools: '/tools',
      execute: '/tools/:toolName',
      mcp: '/mcp'
    },
    substack_url: SUBSTACK_FEED_URL,
    timestamp: new Date().toISOString()
  });
});

// MCP-over-HTTP endpoint (JSON-RPC 2.0)
app.post('/mcp', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;

    // Validate JSON-RPC 2.0 format
    if (jsonrpc !== '2.0') {
      return res.json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid Request'
        },
        id: id || null
      });
    }

    let result;

    switch (method) {
      case 'initialize': {
        result = {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'trilogy-ai-coe-mcp',
            version: '1.0.0'
          }
        };
        break;
      }

      case 'tools/list': {
        result = {
          tools: [
            {
              name: 'search',
              description: 'Searches for Trilogy AI Center of Excellence articles and returns matching resource IDs.\n\nPurpose:\n1. Search through Trilogy AI CoE Substack articles by keywords, topics, authors, or concepts\n2. Returns only IDs - use the fetch tool to get full content for specific articles\n3. Supports both broad topic searches and specific technical queries\n\nUsage:\n1. Use specific technical terms for targeted results (e.g., "agentic frameworks", "machine learning", "enterprise AI")\n2. Search by author names to find their specific content (e.g., "David Proctor")\n3. Combine multiple keywords for refined searches (e.g., "AI strategy implementation")\n4. Use broad terms for comprehensive overviews (e.g., "artificial intelligence", "automation")\n5. Search for industry concepts (e.g., "transformation", "best practices", "case studies")\n\nQuery Formation:\n• Single keywords: "AI", "automation", "strategy"\n• Multiple keywords: "agentic AI frameworks", "enterprise machine learning"\n• Author searches: "David Proctor insights", "Trilogy team"\n• Topic combinations: "AI implementation best practices"\n• Technical terms: "LLMs", "neural networks", "data science", "MLOps"\n\nContent Areas Available:\n• Enterprise AI strategy and implementation\n• Agentic AI frameworks and automation\n• Machine learning best practices\n• Data science methodologies\n• AI transformation case studies\n• Technical leadership insights\n• Industry analysis and trends\n\nExamples:\n• "agentic frameworks" → finds articles about agentic AI systems\n• "David Proctor enterprise AI" → finds David\'s articles on enterprise AI\n• "machine learning best practices" → finds ML methodology articles\n• "AI transformation case studies" → finds implementation examples\n• "automation strategy" → finds articles on automation approaches',
              input_schema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Search query for Trilogy AI CoE articles. Use specific technical terms, author names, or topic combinations for best results.'
                  }
                },
                required: ['query']
              },
              output_schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          description: 'ID of the resource.'
                        },
                        title: {
                          type: 'string',
                          description: 'Title or headline of the resource.'
                        },
                        text: {
                          type: 'string',
                          description: 'Text snippet or summary from the resource.'
                        },
                        url: {
                          type: ['string', 'null'],
                          description: 'URL of the resource. Optional but needed for citations to work.'
                        }
                      },
                      required: ['id', 'title', 'text']
                    }
                  }
                },
                required: ['results']
              }
            },
            {
              name: 'fetch',
              description: 'Retrieves detailed content for a specific resource identified by the given ID.',
              input_schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the resource to fetch.'
                  }
                },
                required: ['id']
              },
              output_schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'ID of the resource.'
                  },
                  title: {
                    type: 'string',
                    description: 'Title or headline of the fetched resource.'
                  },
                  text: {
                    type: 'string',
                    description: 'Complete textual content of the resource.'
                  },
                  url: {
                    type: ['string', 'null'],
                    description: 'URL of the resource. Optional but needed for citations to work.'
                  },
                  metadata: {
                    type: ['object', 'null'],
                    additionalProperties: {
                      type: 'string'
                    },
                    description: 'Optional metadata providing additional context.'
                  }
                },
                required: ['id', 'title', 'text']
              }
            }
          ],
        };
        break;
        }
        
      case 'tools/call': {
        const { name: toolName, arguments: args } = params;
        
        switch (toolName) {
          case 'search': {
            const { query } = args || {};
            const articles = await fetchSubstackFeed();
            
            // Search through articles
            const searchTerms = query.toLowerCase().split(' ');
            const matchingResults = articles
              .filter(article => {
                const searchText = `${article.title} ${article.excerpt || ''} ${article.author || ''}`.toLowerCase();
                return searchTerms.some((term: string) => searchText.includes(term));
              })
              .slice(0, 10) // Limit to 10 results
              .map(article => ({
                id: article.id,
                title: article.title,
                text: article.excerpt || article.title,
                url: article.url
              }));

            result = {
          content: [
            {
              type: 'text',
                  text: JSON.stringify({ results: matchingResults })
                }
              ]
            };
            break;
          }

          case 'fetch': {
            const { id } = args || {};
            const articles = await fetchSubstackFeed();
            
            // Find the specific article
            const article = articles.find(a => a.id === id);
            
            if (!article) {
              return res.json({
                jsonrpc: '2.0',
                error: {
                  code: -32602,
                  message: 'Article not found'
                },
                id
              });
            }

            // Fetch full article content if available
            let fullText = article.excerpt || '';
            
            if (article.url) {
              try {
                const articleUrl = article.url;
                const response = await fetchFunction(articleUrl);
                const html = await response.text();
                
                // Basic HTML parsing to extract text content
                const textContent = html
                  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                  .replace(/<[^>]*>/g, ' ')
                  .replace(/\s+/g, ' ')
                  .trim();
                
                if (textContent.length > 500) {
                  fullText = textContent.substring(0, 2000) + '...';
                }
              } catch (fetchError) {
                // If we can't fetch full content, use what we have
                console.error('Failed to fetch full article content:', fetchError);
              }
            }

            const articleResult = {
              id: article.id,
              title: article.title,
              text: fullText || article.title,
              url: article.url,
              metadata: {
                author: article.author || 'Unknown',
                published_date: article.publishedDate || '',
                excerpt: article.excerpt || ''
              }
            };

            result = {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(articleResult)
                }
              ]
            };
            break;
          }

          default:
            return res.json({
              jsonrpc: '2.0',
              error: {
                code: -32601,
                message: `Unknown tool: ${toolName}`
              },
              id
            });
        }
        break;
      }

      default:
        return res.json({
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          },
          id
        });
    }

    // Success response
    res.json({
      jsonrpc: '2.0',
      result,
      id
    });

  } catch (error) {
    debugLog('MCP protocol error', error);
    res.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      id: req.body?.id || null
    });
  }
});

// Start the server
async function main() {
  if (MODE === 'stdio') {
    // Traditional MCP server mode for local usage
  const transport = new StdioServerTransport();
  await server.connect(transport);
    debugLog('Trilogy AI CoE MCP Server started successfully (stdio mode)');
  } else {
    // HTTP server mode for remote usage
    app.listen(PORT, () => {
      console.log(`Trilogy AI CoE MCP Remote Server running on port ${PORT}`);
      debugLog('Server started successfully (HTTP mode)');
  debugLog(`Substack feed URL: ${SUBSTACK_FEED_URL}`);
    });
  }
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 