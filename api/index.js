const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define the schema and model here to avoid import issues
const notesSchema = new mongoose.Schema({
	title: { type: String, default: "" },
	description: { type: String, default: "" }
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", notesSchema);

// connect lazily on first request to keep cold starts lighter
let isConnected = false;
async function ensureDb() {
	if (isConnected) return;
	const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://Yogesh:dbpassword@cluster0.z3kn00g.mongodb.net/notes-manager?retryWrites=true&w=majority&appName=Cluster0";
	console.log('MONGO_URL exists:', !!MONGO_URL);
	console.log('Using MONGO_URL:', MONGO_URL);
	try {
		await mongoose.connect(MONGO_URL, {
			serverSelectionTimeoutMS: 3000,
			socketTimeoutMS: 20000,
			maxPoolSize: 10,
			serverApi: { version: '1', strict: true, deprecationErrors: true }
		});
		console.log('Connected to MongoDB successfully');
		isConnected = true;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		throw error;
	}
}

app.get("/api/test", (req, res) => res.json({ message: "Serverless API is running!", timestamp: new Date().toISOString() }));

app.get("/api/health", (req, res) => {
	res.json({
		status: "ok",
		mongoUrl: process.env.MONGO_URL ? "set" : "not set",
		timestamp: new Date().toISOString()
	});
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

app.get("/api/notes", async (req, res) => {
	try {
		console.log('GET /api/notes called');
		await ensureDb();
		const notes = await Note.find({}).sort({ updatedAt: -1 }).lean();
		console.log('Found notes:', notes.length);
		res.json(notes);
	} catch (e) {
		console.error('Error in /api/notes:', e);
		// Return empty array instead of error for better UX
		res.json([]);
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

app.post("/api/notes", async (req, res) => {
	try {
		console.log('POST /api/notes called with:', req.body);
		await ensureDb();
		const { title, description } = req.body;
		if (!title && !description) return res.status(400).json({ message: "Title or description is required" });
		const created = await Note.create({ title: title || "", description: description || "" });
		console.log('Created note:', created);
		res.status(201).json(created);
	} catch (e) {
		console.error('Error in POST /api/notes:', e);
		// Return error instead of mock to help debug
		res.status(500).json({ message: "Failed to create note", error: e.message });
	}
});

app.put("/api/notes/:id", async (req, res) => {
	try {
		console.log('PUT /api/notes called with:', req.params.id, req.body);
		await ensureDb();
		const { title, description } = req.body;
		
		// Validate input
		if (title === undefined && description === undefined) {
			return res.status(400).json({ message: "Title or description is required" });
		}
		
		const updated = await Note.findByIdAndUpdate(
			req.params.id, 
			{ $set: { title: title || "", description: description || "" } }, 
			{ new: true, runValidators: true }
		).lean();
		
		if (!updated) return res.status(404).json({ message: "Note not found" });
		console.log('Updated note:', updated);
		res.json(updated);
	} catch (e) {
		console.error('Error in PUT /api/notes:', e);
		res.status(500).json({ message: "Failed to update note", error: e.message });
	}
});

app.delete("/api/notes/:id", async (req, res) => {
	try {
		console.log('DELETE /api/notes called with:', req.params.id);
		await ensureDb();
		
		// Validate ID format
		if (!req.params.id || req.params.id.length < 10) {
			return res.status(400).json({ message: "Invalid note ID" });
		}
		
		const deleted = await Note.findByIdAndDelete(req.params.id).lean();
		if (!deleted) {
			console.log('Note not found for deletion:', req.params.id);
			return res.status(404).json({ message: "Note not found" });
		}
		
		console.log('Deleted note:', deleted);
		res.status(200).json({ message: "Note deleted successfully", deletedId: req.params.id });
	} catch (e) {
		console.error('Error in DELETE /api/notes:', e);
		res.status(500).json({ message: "Failed to delete note", error: e.message });
	}
});

module.exports = app;


