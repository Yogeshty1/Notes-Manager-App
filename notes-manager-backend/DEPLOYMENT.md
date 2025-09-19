# 🚀 Backend Deployment Guide

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory:**
   ```bash
   cd notes-manager-backend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

5. **Set Environment Variables:**
   ```bash
   vercel env add MONGO_URL
   # Enter your MongoDB connection string when prompted
   ```

### Option 2: Using Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Backend ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set root directory to `notes-manager-backend`

3. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add `MONGO_URL` with your MongoDB connection string

### Option 3: Using Vercel CLI with GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   git remote add origin https://github.com/yourusername/notes-manager-backend.git
   git push -u origin main
   ```

2. **Deploy from GitHub:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | ✅ Yes |
| `NODE_ENV` | Environment (production) | ❌ Optional |

## 📋 API Endpoints

After deployment, your API will be available at:
- `https://your-backend-url.vercel.app/api/test`
- `https://your-backend-url.vercel.app/api/health`
- `https://your-backend-url.vercel.app/api/notes`

## 🧪 Testing the Deployment

1. **Test API Status:**
   ```bash
   curl https://your-backend-url.vercel.app/api/test
   ```

2. **Test Health Check:**
   ```bash
   curl https://your-backend-url.vercel.app/api/health
   ```

3. **Test Notes API:**
   ```bash
   curl https://your-backend-url.vercel.app/api/notes
   ```

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set:**
   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure `MONGO_URL` is set for Production environment

2. **MongoDB Connection Failed:**
   - Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
   - Check connection string format

3. **Function Timeout:**
   - Check Vercel function logs
   - Optimize database queries

### View Logs:
```bash
vercel logs
```

## 📝 Next Steps

After successful deployment:
1. Copy your backend URL (e.g., `https://your-backend-url.vercel.app`)
2. Update the frontend configuration with this URL
3. Deploy the frontend
