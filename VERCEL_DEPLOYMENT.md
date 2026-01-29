# Deploy BusPulse Backend to Vercel

## Prerequisites
- Vercel account (free)
- GitHub repository with your backend code

## Deployment Steps

1. **Push code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Node.js project

3. **Set Environment Variables**:
   In Vercel dashboard → Settings → Environment Variables, add:
   - `MONGODB_URI` = your MongoDB connection string
   - `PORT` = 8000 (optional, Vercel handles this)

4. **Deploy**:
   - Click "Deploy"
   - Your backend will be available at: `https://your-project-name.vercel.app`

## Important Notes

- **Socket.IO Limitation**: Vercel serverless functions don't support persistent WebSocket connections
- **Alternative**: Consider using Vercel's Edge Functions or deploy Socket.IO separately on Railway/Render
- **Database**: Make sure your MongoDB Atlas allows connections from `0.0.0.0/0` for Vercel

## Update Frontend

Update your frontend to use the new Vercel URL:
```javascript
const API_URL = 'https://your-backend-name.vercel.app';
```

## Testing

Test your deployed API:
```bash
curl https://your-backend-name.vercel.app/api/test
```