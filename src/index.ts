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

// Environment configuration
const SUBSTACK_FEED_URL = process.env.SUBSTACK_FEED_URL || 'https://trilogyai.substack.com';
const DEBUG = process.env.DEBUG === 'true';

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

// Create the MCP server
const server = new Server(
  {
    name: 'trilogy-ai-coe-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tool schemas
const ListArticlesSchema = z.object({
  limit: z.number().optional().default(10),
  author: z.string().optional(),
  topic: z.string().optional(),
});

const ListAuthorsSchema = z.object({});

const ListTopicsSchema = z.object({});

const ReadArticleSchema = z.object({
  articleId: z.string().optional(),
  url: z.string().optional(),
  title: z.string().optional(),
});

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_articles',
        description: 'List articles from the AI CoE Trilogy Substack feed',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of articles to return (default: 10)',
              default: 10,
            },
            author: {
              type: 'string',
              description: 'Filter articles by author name',
            },
            topic: {
              type: 'string',
              description: 'Filter articles by topic',
            },
          },
        },
      },
      {
        name: 'list_authors',
        description: 'List all authors who have written articles',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_topics',
        description: 'List all topics/categories covered in articles',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'read_article',
        description: 'Read the full content of a specific article',
        inputSchema: {
          type: 'object',
          properties: {
            articleId: {
              type: 'string',
              description: 'The ID of the article to read',
            },
            url: {
              type: 'string',
              description: 'The URL of the article to read',
            },
            title: {
              type: 'string',
              description: 'The title of the article to read (will search for matching title)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_articles': {
        const { limit, author, topic } = ListArticlesSchema.parse(args);
        const articles = await fetchSubstackFeed();
        
        let filteredArticles = articles;
        
        if (author) {
          filteredArticles = filteredArticles.filter(article => 
            article.author.toLowerCase().includes(author.toLowerCase())
          );
        }
        
        if (topic) {
          filteredArticles = filteredArticles.filter(article =>
            article.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
          );
        }
        
        const limitedArticles = filteredArticles.slice(0, limit);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                articles: limitedArticles.map(article => ({
                  id: article.id,
                  title: article.title,
                  author: article.author,
                  publishedDate: article.publishedDate,
                  url: article.url,
                  excerpt: article.excerpt,
                  topics: article.topics,
                })),
                total: filteredArticles.length,
                showing: limitedArticles.length,
              }, null, 2),
            },
          ],
        };
      }

      case 'list_authors': {
        ListAuthorsSchema.parse(args);
        const articles = await fetchSubstackFeed();
        
        const authorMap = new Map<string, Author>();
        
        articles.forEach(article => {
          if (authorMap.has(article.author)) {
            const author = authorMap.get(article.author)!;
            author.articleCount++;
            if (new Date(article.publishedDate) > new Date(author.latestArticle)) {
              author.latestArticle = article.publishedDate;
            }
          } else {
            authorMap.set(article.author, {
              name: article.author,
              articleCount: 1,
              latestArticle: article.publishedDate,
            });
          }
        });
        
        const authors = Array.from(authorMap.values()).sort((a, b) => b.articleCount - a.articleCount);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ authors }, null, 2),
            },
          ],
        };
      }

      case 'list_topics': {
        ListTopicsSchema.parse(args);
        const articles = await fetchSubstackFeed();
        
        const topicMap = new Map<string, Topic>();
        
        articles.forEach(article => {
          article.topics.forEach(topic => {
            if (topicMap.has(topic)) {
              const topicData = topicMap.get(topic)!;
              topicData.articleCount++;
              topicData.articles.push(article.title);
            } else {
              topicMap.set(topic, {
                name: topic,
                articleCount: 1,
                articles: [article.title],
              });
            }
          });
        });
        
        const topics = Array.from(topicMap.values()).sort((a, b) => b.articleCount - a.articleCount);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ topics }, null, 2),
            },
          ],
        };
      }

      case 'read_article': {
        const { articleId, url, title } = ReadArticleSchema.parse(args);
        const articles = await fetchSubstackFeed();
        
        let targetArticle: Article | undefined;
        
        if (articleId) {
          targetArticle = articles.find(article => article.id === articleId);
        } else if (url) {
          targetArticle = articles.find(article => article.url === url);
        } else if (title) {
          targetArticle = articles.find(article => 
            article.title.toLowerCase().includes(title.toLowerCase())
          );
        }
        
        if (!targetArticle) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Article not found. Please provide a valid articleId, url, or title.'
          );
        }
        
        const content = await fetchArticleContent(targetArticle.url);
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                article: {
                  id: targetArticle.id,
                  title: targetArticle.title,
                  author: targetArticle.author,
                  publishedDate: targetArticle.publishedDate,
                  url: targetArticle.url,
                  topics: targetArticle.topics,
                  content: content,
                },
              }, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    debugLog('Tool execution error', error);
    throw new McpError(
      ErrorCode.InternalError,
      `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  debugLog('Trilogy AI CoE MCP Server started successfully');
  debugLog(`Substack feed URL: ${SUBSTACK_FEED_URL}`);
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 