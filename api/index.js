const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Note = require("./models/notes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect lazily on first request to keep cold starts lighter
let isConnected = false;
async function ensureDb() {
	if (isConnected) return;
	const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/notes-manager";
	await mongoose.connect(MONGO_URL);
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

module.exports = app;


