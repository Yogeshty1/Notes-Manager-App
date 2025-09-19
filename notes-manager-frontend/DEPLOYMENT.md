# 🚀 Frontend Deployment Guide

## Prerequisites

1. **Backend must be deployed first** (see `../notes-manager-backend/DEPLOYMENT.md`)
2. **Copy your backend URL** from the backend deployment

## Update Backend URL

1. **Edit `src/config.js`:**
   ```javascript
   const config = {
     development: 'http://localhost:3001',
     production: 'https://your-actual-backend-url.vercel.app', // UPDATE THIS
     // ... rest of config
   };
   ```

2. **Replace `your-actual-backend-url.vercel.app`** with your actual backend URL from Vercel

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend directory:**
   ```bash
   cd notes-manager-frontend
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Frontend ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository
   - Set root directory to `notes-manager-frontend`

3. **Build Settings:**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`

### Option 3: Using Vercel CLI with GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial frontend commit"
   git remote add origin https://github.com/yourusername/notes-manager-frontend.git
   git push -u origin main
   ```

2. **Deploy from GitHub:**
   ```bash
   vercel --prod
   ```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | ❌ Optional (uses config.js) |
| `NODE_ENV` | Environment (production) | ❌ Optional |

## 🧪 Testing the Deployment

1. **Open your frontend URL** (e.g., `https://your-frontend-url.vercel.app`)

2. **Test API Connection:**
   - Open browser developer tools
   - Check Network tab for API calls
   - Verify API calls are going to your backend URL

3. **Test CRUD Operations:**
   - Create a new note
   - Edit an existing note
   - Delete a note
   - Verify all operations work

## 🔍 Troubleshooting

### Common Issues:

1. **API Calls Failing:**
   - Check if backend URL is correct in `src/config.js`
   - Verify backend is deployed and accessible
   - Check browser console for CORS errors

2. **Build Failures:**
   - Check if all dependencies are installed
   - Verify React scripts are working locally

3. **CORS Errors:**
   - Ensure backend CORS is configured for your frontend domain
   - Check backend deployment logs

### Debug Steps:

1. **Check Backend Status:**
   ```bash
   curl https://your-backend-url.vercel.app/api/test
   ```

2. **Check Frontend Console:**
   - Open browser developer tools
   - Look for API call errors
   - Check Network tab for failed requests

3. **View Vercel Logs:**
   ```bash
   vercel logs
   ```

## 📝 Configuration Files

- `src/config.js` - API URL configuration
- `src/api.js` - API client with error handling
- `package.json` - Dependencies and scripts
- `public/index.html` - HTML template

## 🎯 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Backend URL updated in `src/config.js`
- [ ] Frontend builds successfully
- [ ] Frontend deployed to Vercel
- [ ] API calls working in browser
- [ ] Create, Read, Update, Delete operations working
- [ ] No console errors

## 🚀 Next Steps

After successful deployment:
1. Test all functionality
2. Share your application URL
3. Monitor performance and errors
4. Set up monitoring if needed
