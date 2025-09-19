const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Configure CORS for frontend-backend communication
app.use(cors({
	origin: [
		'http://localhost:3000', // Local development
		'https://notes-manager-app.vercel.app', // Vercel frontend
		'https://notes-manager-app-git-main-yogeshty1.vercel.app', // Vercel preview
		/^https:\/\/.*\.vercel\.app$/ // Any Vercel subdomain
	],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Define the schema and model here to avoid import issues
const notesSchema = new mongoose.Schema({
	title: { type: String, default: "" },
	description: { type: String, default: "" }
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", notesSchema);

// Optimized MongoDB connection for serverless environment
let isConnected = false;
let connectionPromise = null;

async function ensureDb() {
	// Return existing connection if available
	if (isConnected && mongoose.connection.readyState === 1) {
		return;
	}

	// If connection is in progress, wait for it
	if (connectionPromise) {
		return connectionPromise;
	}

	// Start new connection
	connectionPromise = connectToDatabase();
	return connectionPromise;
}

async function connectToDatabase() {
	const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://Yogesh:dbpassword@cluster0.z3kn00g.mongodb.net/notes-manager?retryWrites=true&w=majority&appName=Cluster0";
	
	console.log('MONGO_URL exists:', !!process.env.MONGO_URL);
	console.log('Connecting to MongoDB...');
	
	try {
		// Close existing connection if any
		if (mongoose.connection.readyState !== 0) {
			await mongoose.connection.close();
		}

		await mongoose.connect(MONGO_URL, {
			serverSelectionTimeoutMS: 5000, // Increased for serverless
			socketTimeoutMS: 45000, // Increased for serverless
			maxPoolSize: 1, // Reduced for serverless
			minPoolSize: 0, // Allow connection to close
			maxIdleTimeMS: 30000, // Close idle connections
			serverApi: { version: '1', strict: true, deprecationErrors: true },
			// Serverless optimizations
			connectTimeoutMS: 10000,
			heartbeatFrequencyMS: 10000
		});
		
		console.log('✅ Connected to MongoDB successfully');
		isConnected = true;
		
		// Handle connection events
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
			isConnected = false;
		});
		
		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
			isConnected = false;
		});
		
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		isConnected = false;
		connectionPromise = null;
		throw error;
	}
}

// Health check endpoint
app.get("/api/test", (req, res) => {
	try {
		res.json({ 
			message: "🚀 Notes Manager API is running!", 
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || 'development',
			mongoUrl: process.env.MONGO_URL ? 'configured' : 'not configured',
			version: '1.0.0',
			status: 'healthy'
		});
	} catch (error) {
		console.error('Error in /api/test:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Detailed health check with MongoDB connection test
app.get("/api/health", async (req, res) => {
	try {
		const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
		const mongoUrl = process.env.MONGO_URL ? 'configured' : 'not configured';
		
		res.json({
			status: "ok",
			mongoUrl: mongoUrl,
			mongoStatus: mongoStatus,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			memory: process.memoryUsage()
		});
	} catch (error) {
		console.error('Error in /api/health:', error);
		res.status(500).json({ 
			status: "error", 
			error: error.message,
			timestamp: new Date().toISOString()
		});
	}
});

// Test endpoint to create a sample note
app.post("/api/test-note", async (req, res) => {
	try {
		await ensureDb();
		const testNote = await Note.create({ 
			title: "Test Note", 
			description: "This is a test note created at " + new Date().toISOString() 
		});
		res.json(testNote);
	} catch (e) {
		console.error('Error creating test note:', e);
		res.status(500).json({ message: "Failed to create test note", error: e.message });
	}
});

// Get all notes
app.get("/api/notes", async (req, res) => {
	try {
		console.log('📝 GET /api/notes called');
		await ensureDb();
		
		const notes = await Note.find({})
			.sort({ updatedAt: -1 })
			.lean()
			.limit(1000); // Limit for performance
			
		console.log(`✅ Found ${notes.length} notes`);
		res.json({
			success: true,
			data: notes,
			count: notes.length,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Error in GET /api/notes:', error);
		res.status(500).json({ 
			success: false,
			error: 'Failed to fetch notes',
			message: error.message,
			data: []
		});
	}
});

app.get("/api/notes/:id", async (req, res) => {
	try {
		await ensureDb();
		const note = await Note.findById(req.params.id).lean();
		if (!note) return res.status(404).json({ message: "Note not found" });
		res.json(note);
	} catch (e) {
		res.status(400).json({ message: "Invalid note id" });
	}
});

// Create a new note
app.post("/api/notes", async (req, res) => {
	try {
		console.log('📝 POST /api/notes called with:', req.body);
		await ensureDb();
		
		const { title, description } = req.body;
		
		// Validation
		if (!title && !description) {
			return res.status(400).json({ 
				success: false,
				error: "Title or description is required",
				message: "At least one field (title or description) must be provided"
			});
		}
		
		// Sanitize input
		const sanitizedTitle = (title || "").trim().substring(0, 500);
		const sanitizedDescription = (description || "").trim().substring(0, 5000);
		
		const created = await Note.create({ 
			title: sanitizedTitle, 
			description: sanitizedDescription 
		});
		
		console.log('✅ Created note:', created._id);
		res.status(201).json({
			success: true,
			data: created,
			message: "Note created successfully",
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Error in POST /api/notes:', error);
		res.status(500).json({ 
			success: false,
			error: "Failed to create note",
			message: error.message
		});
	}
});

// Update an existing note
app.put("/api/notes/:id", async (req, res) => {
	try {
		console.log('📝 PUT /api/notes called with:', req.params.id, req.body);
		await ensureDb();
		
		const { title, description } = req.body;
		
		// Validate ID format
		if (!req.params.id || req.params.id.length < 10) {
			return res.status(400).json({ 
				success: false,
				error: "Invalid note ID",
				message: "Note ID must be a valid MongoDB ObjectId"
			});
		}
		
		// Validate input
		if (title === undefined && description === undefined) {
			return res.status(400).json({ 
				success: false,
				error: "Title or description is required",
				message: "At least one field (title or description) must be provided"
			});
		}
		
		// Sanitize input
		const sanitizedTitle = title !== undefined ? title.trim().substring(0, 500) : undefined;
		const sanitizedDescription = description !== undefined ? description.trim().substring(0, 5000) : undefined;
		
		const updateData = {};
		if (sanitizedTitle !== undefined) updateData.title = sanitizedTitle;
		if (sanitizedDescription !== undefined) updateData.description = sanitizedDescription;
		
		const updated = await Note.findByIdAndUpdate(
			req.params.id, 
			{ $set: updateData }, 
			{ new: true, runValidators: true }
		).lean();
		
		if (!updated) {
			return res.status(404).json({ 
				success: false,
				error: "Note not found",
				message: "The requested note does not exist"
			});
		}
		
		console.log('✅ Updated note:', updated._id);
		res.json({
			success: true,
			data: updated,
			message: "Note updated successfully",
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Error in PUT /api/notes:', error);
		res.status(500).json({ 
			success: false,
			error: "Failed to update note",
			message: error.message
		});
	}
});

// Delete a note
app.delete("/api/notes/:id", async (req, res) => {
	try {
		console.log('📝 DELETE /api/notes called with:', req.params.id);
		await ensureDb();
		
		// Validate ID format
		if (!req.params.id || req.params.id.length < 10) {
			return res.status(400).json({ 
				success: false,
				error: "Invalid note ID",
				message: "Note ID must be a valid MongoDB ObjectId"
			});
		}
		
		const deleted = await Note.findByIdAndDelete(req.params.id).lean();
		if (!deleted) {
			console.log('❌ Note not found for deletion:', req.params.id);
			return res.status(404).json({ 
				success: false,
				error: "Note not found",
				message: "The requested note does not exist"
			});
		}
		
		console.log('✅ Deleted note:', deleted._id);
		res.status(200).json({ 
			success: true,
			message: "Note deleted successfully", 
			deletedId: req.params.id,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('❌ Error in DELETE /api/notes:', error);
		res.status(500).json({ 
			success: false,
			error: "Failed to delete note",
			message: error.message
		});
	}
});

// Global error handler for unhandled routes
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		error: 'Route not found',
		message: `The requested route ${req.method} ${req.originalUrl} does not exist`,
		availableRoutes: [
			'GET /api/test',
			'GET /api/health', 
			'GET /api/notes',
			'POST /api/notes',
			'PUT /api/notes/:id',
			'DELETE /api/notes/:id'
		]
	});
});

// Global error handler
app.use((error, req, res, next) => {
	console.error('🚨 Global error handler:', error);
	res.status(500).json({
		success: false,
		error: 'Internal server error',
		message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
		timestamp: new Date().toISOString()
	});
});

module.exports = app;


