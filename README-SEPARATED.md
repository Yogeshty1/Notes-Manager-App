# 📝 Notes Manager - Separated Projects

This repository now contains **two separate projects** for independent deployment:

## 🏗️ Project Structure

```
Notes-Manager-App/
├── notes-manager-backend/     # Backend API (Node.js + Express + MongoDB)
├── notes-manager-frontend/    # Frontend App (React + JavaScript)
└── README-SEPARATED.md        # This file
```

## 🚀 Quick Start

### 1. Deploy Backend First

```bash
cd notes-manager-backend
# Follow DEPLOYMENT.md instructions
# Get your backend URL (e.g., https://your-backend.vercel.app)
```

### 2. Update Frontend Configuration

```bash
cd notes-manager-frontend
# Edit src/config.js
# Update production URL with your backend URL
```

### 3. Deploy Frontend

```bash
# Follow DEPLOYMENT.md instructions
# Deploy to Vercel
```

## 📁 Project Details

### 🔧 Backend (`notes-manager-backend/`)

**Technology Stack:**
- Node.js + Express.js
- MongoDB + Mongoose
- Vercel Serverless Functions
- CORS enabled for frontend communication

**Features:**
- RESTful API with full CRUD operations
- Optimized for serverless deployment
- Comprehensive error handling
- Input validation and sanitization
- MongoDB connection optimization

**API Endpoints:**
- `GET /api/test` - API status
- `GET /api/health` - Health check
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### 🎨 Frontend (`notes-manager-frontend/`)

**Technology Stack:**
- React.js (JavaScript)
- Create React App
- Axios for API calls
- Google Keep-like UI

**Features:**
- Google Keep-inspired interface
- Modal-based note editing
- Optimistic updates
- Responsive design
- Configurable API URL

**Components:**
- `TopBar` - Application header
- `Composer` - Note creation
- `NotesGrid` - Notes display
- `NoteCard` - Individual note
- `NoteEditor` - Note editing modal
- `Modal` - Reusable modal component

## 🔧 Configuration

### Backend Configuration

**Environment Variables:**
- `MONGO_URL` - MongoDB connection string (required)

**Files:**
- `api/index.js` - Main API server
- `vercel.json` - Vercel configuration
- `package.json` - Dependencies

### Frontend Configuration

**API URL Configuration:**
- `src/config.js` - Environment-based API URLs
- `src/api.js` - API client with error handling

**Files:**
- `src/App.js` - Main application
- `src/components/` - React components
- `package.json` - Dependencies

## 🚀 Deployment Process

### Step 1: Backend Deployment

1. **Navigate to backend:**
   ```bash
   cd notes-manager-backend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables:**
   ```bash
   vercel env add MONGO_URL
   ```

4. **Test deployment:**
   ```bash
   curl https://your-backend-url.vercel.app/api/test
   ```

### Step 2: Frontend Configuration

1. **Update API URL:**
   ```bash
   cd notes-manager-frontend
   # Edit src/config.js
   # Update production URL with your backend URL
   ```

2. **Test locally:**
   ```bash
   npm start
   # Verify API calls work
   ```

### Step 3: Frontend Deployment

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Test full application:**
   - Open your frontend URL
   - Test all CRUD operations
   - Verify no console errors

## 🔍 Troubleshooting

### Common Issues:

1. **Backend not accessible:**
   - Check Vercel deployment status
   - Verify environment variables
   - Check MongoDB connection

2. **Frontend API calls failing:**
   - Verify backend URL in `src/config.js`
   - Check CORS configuration
   - Check browser console for errors

3. **CORS errors:**
   - Ensure backend CORS includes frontend domain
   - Check if both are deployed correctly

### Debug Commands:

```bash
# Test backend
curl https://your-backend-url.vercel.app/api/test

# Check Vercel logs
vercel logs

# Test frontend locally
cd notes-manager-frontend
npm start
```

## 📚 Documentation

- **Backend:** `notes-manager-backend/README.md`
- **Frontend:** `notes-manager-frontend/README.md`
- **Backend Deployment:** `notes-manager-backend/DEPLOYMENT.md`
- **Frontend Deployment:** `notes-manager-frontend/DEPLOYMENT.md`

## 🎯 Success Criteria

- [ ] Backend deployed and accessible
- [ ] Frontend configured with backend URL
- [ ] Frontend deployed and accessible
- [ ] All CRUD operations working
- [ ] No console errors
- [ ] Responsive design working

## 🔄 Updates

To update either project:

1. **Backend updates:**
   ```bash
   cd notes-manager-backend
   # Make changes
   git add .
   git commit -m "Update backend"
   git push origin main
   vercel --prod
   ```

2. **Frontend updates:**
   ```bash
   cd notes-manager-frontend
   # Make changes
   git add .
   git commit -m "Update frontend"
   git push origin main
   vercel --prod
   ```

## 📞 Support

For issues:
1. Check deployment logs: `vercel logs`
2. Check browser console for errors
3. Verify environment variables
4. Test API endpoints directly
