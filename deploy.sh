#!/bin/bash

# Trilogy AI CoE MCP Remote Server - AWS Elastic Beanstalk Deployment Script

set -e

echo "🚀 Deploying Trilogy AI CoE MCP Remote Server to AWS Elastic Beanstalk"

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo "❌ EB CLI is not installed. Please install it first:"
    echo "   pip install awsebcli"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

# Install dependencies and build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building the application..."
npm run build

# Initialize EB application if not already done
if [ ! -f .elasticbeanstalk/config.yml ]; then
    echo "🔧 Initializing Elastic Beanstalk application..."
    eb init trilogy-ai-coe-mcp --platform node.js --region us-east-1
fi

# Create environment if it doesn't exist
if ! eb list | grep -q "trilogy-ai-coe-mcp-env"; then
    echo "🌍 Creating Elastic Beanstalk environment..."
    eb create trilogy-ai-coe-mcp-env --instance-type t3.micro
else
    echo "📤 Deploying to existing environment..."
    eb deploy trilogy-ai-coe-mcp-env
fi

# Get the application URL
echo "✅ Deployment complete!"
echo "🌐 Your MCP server is available at:"
eb status trilogy-ai-coe-mcp-env | grep "CNAME" | awk '{print "   https://" $2}'

echo ""
echo "🔗 To connect your AI assistant, use this configuration:"
echo '   {'
echo '     "mcpServers": {'
echo '       "trilogy-ai-coe": {'
echo '         "command": "npx",'
echo '         "args": ["@modelcontextprotocol/server-fetch", "https://YOUR_URL_HERE"]'
echo '       }'
echo '     }'
echo '   }'
echo ""
echo "📊 To monitor your application:"
echo "   eb logs trilogy-ai-coe-mcp-env"
echo "   eb health trilogy-ai-coe-mcp-env"
echo ""
echo "🗑️  To terminate the environment:"
echo "   eb terminate trilogy-ai-coe-mcp-env" 