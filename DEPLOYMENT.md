# Deployment Guide

This guide covers deploying the Trilogy AI CoE MCP Remote Server to various cloud platforms.

**✨ The deployed server is now compatible with ChatGPT's Deep Research MCP connector!**

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- Account on your chosen cloud platform

## Platform-Specific Deployments

### AWS Elastic Beanstalk (Recommended)

**Cost**: ~$10-20/month for t3.micro instance

Our production server is deployed on AWS EB with HTTPS and custom domain.

1. **Install AWS CLI and EB CLI**:
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   
   # Install EB CLI
   pip install awsebcli
   
   # Configure AWS credentials
   aws configure
   ```

2. **Deploy using the script**:
   ```bash
   ./deploy.sh
   ```

3. **Manual deployment**:
   ```bash
   npm install && npm run build
   eb init trilogy-ai-coe-mcp --platform node.js --region us-east-1
   eb create trilogy-ai-coe-mcp-env --instance-type t3.micro
   eb deploy
   ```

4. **Setup HTTPS (for ChatGPT compatibility)**:
   - Request SSL certificate in AWS Certificate Manager
   - Configure load balancer listener for port 443
   - Update security group to allow HTTPS traffic

### Railway

**Cost**: ~$5/month for hobby plan

1. **Connect GitHub repo**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Import this repository

2. **Set environment variables**:
   ```
   MODE=http
   PORT=3000
   SUBSTACK_FEED_URL=https://trilogyai.substack.com
   NODE_ENV=production
   ```

3. **Deploy**: Railway will automatically deploy on git push
4. **HTTPS**: Railway provides HTTPS by default

### Render

**Cost**: Free tier available, ~$7/month for paid plans

1. **Connect GitHub repo**:
   - Go to [render.com](https://render.com)
   - Connect your GitHub account
   - Create new Web Service from this repo

2. **Configuration**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     MODE=http
     PORT=10000
     SUBSTACK_FEED_URL=https://trilogyai.substack.com
     NODE_ENV=production
     ```

3. **HTTPS**: Render provides HTTPS by default

### Google Cloud Run

**Cost**: Pay per request, very cost-effective for low traffic

1. **Setup Google Cloud**:
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   gcloud init
   gcloud auth configure-docker
   ```

2. **Deploy**:
   ```bash
   # Build and push Docker image
   docker build -t gcr.io/YOUR_PROJECT_ID/trilogy-ai-coe-mcp .
   docker push gcr.io/YOUR_PROJECT_ID/trilogy-ai-coe-mcp
   
   # Deploy to Cloud Run
   gcloud run deploy trilogy-ai-coe-mcp \
     --image gcr.io/YOUR_PROJECT_ID/trilogy-ai-coe-mcp \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars MODE=http,SUBSTACK_FEED_URL=https://trilogyai.substack.com
   ```

3. **HTTPS**: Cloud Run provides HTTPS by default

### Heroku

**Cost**: Free tier discontinued, ~$7/month for basic plans

1. **Install Heroku CLI**:
   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku
   
   # Login
   heroku login
   ```

2. **Deploy**:
   ```bash
   # Create app
   heroku create trilogy-ai-coe-mcp
   
   # Set environment variables
   heroku config:set MODE=http
   heroku config:set SUBSTACK_FEED_URL=https://trilogyai.substack.com
   heroku config:set NODE_ENV=production
   
   # Deploy
   git push heroku main
   ```

3. **HTTPS**: Heroku provides HTTPS by default

### DigitalOcean App Platform

**Cost**: ~$5/month for basic plan

1. **Connect GitHub repo**:
   - Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
   - Create new App from GitHub repo

2. **Configuration**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Environment Variables:
     ```
     MODE=http
     PORT=8080
     SUBSTACK_FEED_URL=https://trilogyai.substack.com
     NODE_ENV=production
     ```

3. **HTTPS**: DigitalOcean provides HTTPS by default

### Traditional VPS (Ubuntu/Debian)

**Cost**: ~$5-20/month depending on provider

1. **Server setup**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx (required for HTTPS)
   sudo apt install nginx certbot python3-certbot-nginx
   ```

2. **Deploy application**:
   ```bash
   # Clone repository
   git clone https://github.com/dp-pcs/Trilogy-AI-CoE-MCP-Remote.git
   cd Trilogy-AI-CoE-MCP-Remote
   
   # Install dependencies and build
   npm install
   npm run build
   
   # Create environment file
   cat > .env << EOF
   MODE=http
   PORT=3000
   SUBSTACK_FEED_URL=https://trilogyai.substack.com
   NODE_ENV=production
   DEBUG=false
   EOF
   
   # Start with PM2
   pm2 start dist/index.js --name trilogy-ai-coe-mcp
   pm2 startup
   pm2 save
   ```

3. **Setup Nginx reverse proxy with HTTPS**:
   ```nginx
   # /etc/nginx/sites-available/trilogy-ai-coe-mcp
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/trilogy-ai-coe-mcp /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Setup HTTPS with Let's Encrypt
   sudo certbot --nginx -d your-domain.com
   ```

## Docker Deployment

For any platform supporting Docker:

1. **Build image**:
   ```bash
   docker build -t trilogy-ai-coe-mcp .
   ```

2. **Run locally**:
   ```bash
   docker run -p 3000:3000 \
     -e MODE=http \
     -e SUBSTACK_FEED_URL=https://trilogyai.substack.com \
     trilogy-ai-coe-mcp
   ```

3. **Push to registry**:
   ```bash
   # Docker Hub
   docker tag trilogy-ai-coe-mcp your-username/trilogy-ai-coe-mcp
   docker push your-username/trilogy-ai-coe-mcp
   
   # AWS ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com
   docker tag trilogy-ai-coe-mcp YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/trilogy-ai-coe-mcp
   docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/trilogy-ai-coe-mcp
   ```

## Environment Variables

All deployments need these environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MODE` | Yes | `http` | Server mode (always `http` for remote) |
| `PORT` | No | `3000` | Port to run the server on |
| `SUBSTACK_FEED_URL` | Yes | `https://trilogyai.substack.com` | Substack feed URL |
| `NODE_ENV` | No | `production` | Node.js environment |
| `DEBUG` | No | `false` | Enable debug logging |

## Post-Deployment

1. **Test your deployment**:
   ```bash
   # Test basic endpoints
   curl https://your-server-url.com/health
   curl https://your-server-url.com/tools
   
   # Test MCP protocol (ChatGPT compatible)
   curl -X POST https://your-server-url.com/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
   
   # Test search functionality
   curl -X POST https://your-server-url.com/tools/search \
     -H "Content-Type: application/json" \
     -d '{"query": "AI strategy"}'
   ```

2. **Configure AI assistants**:

   **For ChatGPT**:
   - Go to ChatGPT Settings → Connectors
   - Add MCP Server: `https://your-server-url.com/mcp`

   **For Claude Desktop** (create local client):
   ```json
   {
     "mcpServers": {
       "trilogy-ai-coe-remote": {
         "command": "node",
         "args": ["/path/to/mcp-remote-client.js"]
       }
     }
   }
   ```

## ChatGPT Deep Research Integration

Your deployed server supports ChatGPT's Deep Research feature:

1. **Requirements**:
   - HTTPS endpoint (required by ChatGPT)
   - `/mcp` endpoint for JSON-RPC 2.0 protocol
   - `search` and `fetch` tools with proper schemas

2. **Setup in ChatGPT**:
   - Name: `Trilogy AI CoE MCP Server`
   - URL: `https://your-server-url.com/mcp`
   - Authentication: None

3. **Usage**:
   - Use Deep Research to analyze AI trends
   - Search Trilogy's AI CoE content
   - Get comprehensive insights with proper citations

## Monitoring and Maintenance

- **Health checks**: All platforms should monitor `/health` endpoint
- **Logs**: Check platform-specific logging (CloudWatch, Railway logs, etc.)
- **Updates**: Redeploy when you update the code
- **Scaling**: Most platforms offer auto-scaling options
- **HTTPS**: Essential for ChatGPT compatibility

## Troubleshooting

### Common Issues

1. **Port binding errors**: Ensure `PORT` environment variable matches platform requirements
2. **Build failures**: Check Node.js version (18+ required)
3. **CORS issues**: Verify CORS is enabled in the application
4. **Memory issues**: Consider upgrading to higher-tier plans for better performance
5. **HTTPS issues**: ChatGPT requires HTTPS - ensure SSL is properly configured
6. **MCP protocol errors**: Verify `/mcp` endpoint returns proper JSON-RPC 2.0 responses

### Platform-Specific Notes

- **Railway**: Automatically detects Node.js and runs `npm start`, provides HTTPS
- **Render**: Uses `PORT=10000` by default, provides HTTPS
- **Heroku**: Requires `Procfile` (already included), provides HTTPS
- **Google Cloud Run**: Automatically handles HTTPS
- **AWS EB**: Uses port 8080 internally, requires manual HTTPS setup

### ChatGPT Integration Issues

1. **Server not reachable**: Ensure HTTPS is working
2. **Tools not appearing**: Verify `/mcp` endpoint responds correctly
3. **Search not working**: Check `search` tool returns proper result format
4. **No citations**: Ensure articles have valid URLs in responses

## Cost Optimization

- **Google Cloud Run**: Best for low traffic (pay per request)
- **Railway/Render**: Good for consistent low traffic
- **AWS EB**: Good for production workloads with predictable traffic
- **VPS**: Most cost-effective for high traffic or multiple applications

## Security Considerations

- **HTTPS**: Required for production and ChatGPT integration
- **CORS**: Properly configured for cross-origin requests
- **Rate limiting**: Consider implementing for high-traffic deployments
- **Environment variables**: Never commit secrets to git
- **Updates**: Keep dependencies updated for security patches 