# Notes Manager Backend API

A robust, serverless backend API for the Notes Manager application, optimized for Vercel deployment.

## 🚀 Features

- **RESTful API** with full CRUD operations
- **MongoDB Integration** with optimized connection handling
- **Serverless Optimized** for Vercel deployment
- **Comprehensive Error Handling** with detailed logging
- **Input Validation & Sanitization** for security
- **CORS Configuration** for frontend integration

## 📋 API Endpoints

### Health & Status
- `GET /api/test` - Basic API status check
- `GET /api/health` - Detailed health check with MongoDB status

### Notes CRUD Operations
- `GET /api/notes` - Get all notes (sorted by updatedAt desc)
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables:
   ```bash
   export MONGO_URL="your-mongodb-connection-string"
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## 🚀 Vercel Deployment

### Option 1: Deploy Backend Only
1. Use the `vercel-backend.json` configuration
2. Set environment variables in Vercel dashboard:
   - `MONGO_URL`: Your MongoDB connection string
   - `NODE_ENV`: production

### Option 2: Deploy with Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add MONGO_URL
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |

## 📊 Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Security Features

- **Input Sanitization**: All inputs are trimmed and length-limited
- **CORS Configuration**: Properly configured for frontend domains
- **Error Handling**: No sensitive information leaked in production
- **Validation**: Comprehensive input validation on all endpoints

## 📈 Performance Optimizations

- **Connection Pooling**: Optimized for serverless environment
- **Lazy Loading**: MongoDB connection established on first request
- **Response Limits**: Query results limited to prevent memory issues
- **Lean Queries**: Using `.lean()` for better performance

## 🐛 Debugging

### Local Testing
```bash
# Test API endpoints
curl http://localhost:3001/api/test
curl http://localhost:3001/api/health
curl http://localhost:3001/api/notes
```

### Vercel Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

## 📝 API Examples

### Create a Note
```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "description": "Note content"}'
```

### Update a Note
```bash
curl -X PUT http://localhost:3001/api/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

### Delete a Note
```bash
curl -X DELETE http://localhost:3001/api/notes/NOTE_ID
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check `MONGO_URL` environment variable
   - Verify MongoDB Atlas IP whitelist
   - Check network connectivity

2. **CORS Errors**
   - Verify frontend domain is in CORS configuration
   - Check if credentials are properly set

3. **Function Timeout**
   - Check Vercel function timeout settings
   - Optimize database queries
   - Check for infinite loops

### Support
For issues and questions, check the Vercel deployment logs and MongoDB Atlas logs.
