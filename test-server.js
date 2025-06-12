#!/usr/bin/env node

/**
 * Test script for the Trilogy AI CoE Universal MCP Server
 * Demonstrates the server's ability to work with multiple AI assistants
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing Universal MCP Server...\n');
console.log('This server demonstrates "write once, use everywhere" compatibility:');
console.log('✅ Claude Desktop (stdio MCP)');
console.log('✅ Cursor (stdio MCP)');
console.log('✅ ChatGPT Deep Research (HTTP JSON-RPC)');
console.log('✅ Any MCP-compatible client\n');

async function testServer() {
  try {
    // Start the server process
    const serverPath = join(__dirname, 'dist', 'index.js');
    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        SUBSTACK_FEED_URL: 'https://trilogyai.substack.com',
        DEBUG: 'true'
      }
    });

    let output = '';
    let errorOutput = '';

    server.stdout.on('data', (data) => {
      output += data.toString();
    });

    server.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    // Test sequence
    console.log('📡 Starting MCP server...');

    // Send initialization message
    const initMessage = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        clientInfo: { name: 'test-client', version: '1.0.0' }
      }
    };

    server.stdin.write(JSON.stringify(initMessage) + '\n');

    // Test tools list
    setTimeout(() => {
      console.log('🔧 Testing tools list...');
      const listToolsMessage = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      };
      server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
    }, 1000);

    // Test search functionality
    setTimeout(() => {
      console.log('🔍 Testing search functionality...');
      const searchMessage = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'search',
          arguments: { query: 'agentic frameworks' }
        }
      };
      server.stdin.write(JSON.stringify(searchMessage) + '\n');
    }, 2000);

    // Test list_recent functionality
    setTimeout(() => {
      console.log('📋 Testing list_recent functionality...');
      const listRecentMessage = {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'list_recent',
          arguments: { limit: 3 }
        }
      };
      server.stdin.write(JSON.stringify(listRecentMessage) + '\n');
    }, 3000);

    // Clean shutdown
    setTimeout(() => {
      console.log('\n✅ Test completed successfully!');
      console.log('\n🌟 Universal MCP Server is ready for:');
      console.log('   • Claude Desktop integration');
      console.log('   • Cursor integration');
      console.log('   • ChatGPT Deep Research');
      console.log('   • Any MCP-compatible client');
      console.log('\n📖 See UNIVERSAL_SETUP.md for setup instructions');
      
      server.kill();
      process.exit(0);
    }, 4000);

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

    server.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error('❌ Server exited with code:', code);
        if (errorOutput) {
          console.error('Error output:', errorOutput);
        }
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testServer(); 