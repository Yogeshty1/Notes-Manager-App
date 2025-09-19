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
	const MONGO_URL = process.env.MONGO_URL;
	console.log('MONGO_URL exists:', !!MONGO_URL);
	if (!MONGO_URL) {
		throw new Error('MONGO_URL environment variable is not set');
	}
	try {
		await mongoose.connect(MONGO_URL, {
			serverSelectionTimeoutMS: 5000,
			socketTimeoutMS: 45000
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
		res.status(500).json({ message: "Failed to create note", error: e.message });
	}
});

app.put("/api/notes/:id", async (req, res) => {
	try {
		await ensureDb();
		const { title, description } = req.body;
		const updated = await Note.findByIdAndUpdate(req.params.id, { $set: { title, description } }, { new: true, runValidators: true }).lean();
		if (!updated) return res.status(404).json({ message: "Note not found" });
		res.json(updated);
	} catch (e) {
		res.status(400).json({ message: "Failed to update note" });
	}
});

app.delete("/api/notes/:id", async (req, res) => {
	try {
		await ensureDb();
		const deleted = await Note.findByIdAndDelete(req.params.id).lean();
		if (!deleted) return res.status(404).json({ message: "Note not found" });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ message: "Failed to delete note" });
	}
});

module.exports = app;


