# 🚌 BusPulse Backend

Backend API server for the BusPulse real-time bus tracking system.

## 🚀 Setup

```bash
npm install
npm start
```

Server runs on: http://localhost:5000

## 📡 API Endpoints

- `POST /api/buses/location` - Update bus location
- WebSocket connection for real-time updates

## 🔧 Environment

- Node.js backend with Express
- Socket.IO for real-time communication
- CORS enabled for frontend connection