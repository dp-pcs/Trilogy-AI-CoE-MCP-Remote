#!/usr/bin/env node

/**
 * Simple test script for the Trilogy AI CoE MCP Server
 * This script tests the server by sending MCP protocol messages
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test the MCP server
async function testServer() {
  console.log('🧪 Testing Trilogy AI CoE MCP Server...\n');

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

    // Send initialization message
    const initMessage = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'test-client',
          version: '1.0.0'
        }
      }
    };

    server.stdin.write(JSON.stringify(initMessage) + '\n');

    // Send list tools request
    setTimeout(() => {
      const listToolsMessage = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      };
      server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
    }, 1000);

    // Test list_articles tool
    setTimeout(() => {
      const callToolMessage = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'list_articles',
          arguments: {
            limit: 3
          }
        }
      };
      server.stdin.write(JSON.stringify(callToolMessage) + '\n');
    }, 2000);

    // Close after tests
    setTimeout(() => {
      server.kill();
    }, 5000);

    server.on('close', (code) => {
      console.log('📊 Test Results:');
      console.log('================');
      
      if (code === 0 || code === null) {
        console.log('✅ Server started successfully');
      } else {
        console.log(`❌ Server exited with code: ${code}`);
      }

      if (output) {
        console.log('\n📤 Server Output:');
        console.log(output);
      }

      if (errorOutput) {
        console.log('\n🐛 Debug Output:');
        console.log(errorOutput);
      }

      console.log('\n🎉 Test completed!');
      console.log('\nNext steps:');
      console.log('1. Configure your AI assistant (Claude Desktop, Cursor, etc.)');
      console.log('2. Add the server configuration to your MCP settings');
      console.log('3. Restart your AI assistant');
      console.log('4. Try asking: "List the latest articles from the AI CoE"');
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testServer(); 