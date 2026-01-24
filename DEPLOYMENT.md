# 🚌 BusPulse Backend - Complete Deployment Guide

## 📋 Prerequisites
- Node.js 18+ installed
- npm 8+ installed
- Git installed

## 🚀 A-Z Deployment Steps

### Option 1: Railway (Recommended - Free & Easy)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `amansm47/BackBus`
   - Railway auto-detects Node.js

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5001
   FRONTEND_URL=https://amansm47.github.io
   ```

4. **Deploy**
   - Railway automatically builds and deploys
   - Get your URL: `https://your-app.railway.app`

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from heroku.com/cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-buspulse-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://amansm47.github.io
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 3: Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub

2. **Create Web Service**
   - Select `amansm47/BackBus`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   FRONTEND_URL=https://amansm47.github.io
   ```

## 🔧 Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/amansm47/BackBus.git
   cd BackBus
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access**
   - Server: http://localhost:5001
   - Simulator: http://localhost:5001/simulator

## 📡 API Endpoints

- `POST /api/buses/location` - Update bus location
- `GET /simulator` - Bus simulator interface
- WebSocket connection for real-time updates

## 🌐 Update Frontend

After backend deployment, update your frontend to use the new backend URL:

1. In your React app, replace `http://localhost:5001` with your deployed URL
2. Update CORS origins in server.js if needed

## 🔍 Testing Deployment

1. Visit your deployed URL
2. Check `/simulator` endpoint
3. Test API with Postman or curl:
   ```bash
   curl -X POST https://your-backend-url.com/api/buses/location \
   -H "Content-Type: application/json" \
   -d '{"busId":"BUS_01","latitude":25.4356,"longitude":81.8462,"speed":15}'
   ```

## 🐛 Troubleshooting

- **CORS Issues**: Update origins in server.js
- **Port Issues**: Ensure PORT environment variable is set
- **Build Failures**: Check Node.js version compatibility
- **WebSocket Issues**: Verify hosting platform supports WebSockets

## 📞 Support

- Check logs in your hosting platform dashboard
- Verify environment variables are set correctly
- Ensure all dependencies are installed