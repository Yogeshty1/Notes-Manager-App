const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Note = require("./models/notes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: "Something went wrong!" });
});

// Add root route handler
app.get("/", (req, res) => {
	res.send("Notes Manager API is running");
});

// connect lazily on first request to keep cold starts lighter
let isConnected = false;
async function ensureDb() {
	if (isConnected) return;
	const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/notes-manager";
	console.log('Attempting to connect to MongoDB...'); // Add logging
	if (!MONGO_URL) {
		throw new Error('MONGO_URL environment variable is not set');
	}
	await mongoose.connect(MONGO_URL);
	console.log('Connected to MongoDB successfully'); // Add logging
	isConnected = true;
}

app.get("/api/test", (req, res) => res.send("Serverless API is running!"));

app.get("/api/notes", async (req, res) => {
	try {
		await ensureDb();
		const notes = await Note.find({}).sort({ updatedAt: -1 }).lean();
		res.json(notes);
	} catch (e) {
		res.status(500).json({ message: "Failed to fetch notes" });
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
		await ensureDb();
		const { title, description } = req.body;
		if (!title && !description) return res.status(400).json({ message: "Title or description is required" });
		const created = await Note.create({ title: title || "", description: description || "" });
		res.status(201).json(created);
	} catch (e) {
		res.status(500).json({ message: "Failed to create note" });
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

// Add this after your other route definitions
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Add this at the bottom of the file
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;


