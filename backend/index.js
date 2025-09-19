const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const cors = require("cors");
const Note = require("./models/notes.js");


const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/notes-manager";
const PORT = process.env.PORT || 3001;

// connect to the database
mongoose.connect(MONGO_URL, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000
}).then(() => {
	console.log("MongoDB connected successfully");
}).catch(err => {
	console.error("MongoDB connection error:", err);
	process.exit(1);
});

// simple helpers so the server understands json, forms, and allows browser calls
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// quick health check
app.get("/test", (req, res) => res.send("Server is running!"));

// notes api
app.get("/api/notes", async (req, res) => {
	try {
		const notes = await Note.find({}).sort({ updatedAt: -1 }).lean();
		res.json(notes);
	} catch (error) {
		console.error("Error fetching notes:", error);
		res.status(500).json({ message: "Failed to fetch notes" });
	}
});

app.get("/api/notes/:id", async (req, res) => {
	try {
		const note = await Note.findById(req.params.id).lean();
		if (!note) return res.status(404).json({ message: "Note not found" });
		res.json(note);
	} catch (error) {
		console.error("Error fetching note:", error);
		res.status(400).json({ message: "Invalid note id" });
	}
});

app.post("/api/notes", async (req, res) => {
	try {
		const { title, description } = req.body;
		if (!title && !description) {
			return res.status(400).json({ message: "Title or description is required" });
		}
		const created = await Note.create({ title: title || "", description: description || "" });
		res.status(201).json(created);
	} catch (error) {
		console.error("Error creating note:", error);
		res.status(500).json({ message: "Failed to create note" });
	}
});

app.put("/api/notes/:id", async (req, res) => {
	try {
		const { title, description } = req.body;
		const updated = await Note.findByIdAndUpdate(
			req.params.id,
			{ $set: { title, description } },
			{ new: true, runValidators: true }
		).lean();
		if (!updated) return res.status(404).json({ message: "Note not found" });
		res.json(updated);
	} catch (error) {
		console.error("Error updating note:", error);
		res.status(400).json({ message: "Failed to update note" });
	}
});

app.delete("/api/notes/:id", async (req, res) => {
	try {
		const deleted = await Note.findByIdAndDelete(req.params.id).lean();
		if (!deleted) return res.status(404).json({ message: "Note not found" });
		res.status(204).send();
	} catch (error) {
		console.error("Error deleting note:", error);
		res.status(400).json({ message: "Failed to delete note" });
	}
});

// serve the built frontend if it exists
const clientBuildPathCRA = path.join(__dirname, "..", "client", "build");
const clientBuildPathVite = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientBuildPathCRA));
app.use(express.static(clientBuildPathVite));
app.get(/^\/(?!api).*/, (req, res) => {
	const indexHtmlCRA = path.join(clientBuildPathCRA, "index.html");
	const indexHtmlVite = path.join(clientBuildPathVite, "index.html");
	res.sendFile(indexHtmlCRA, (err) => {
		if (err) {
			res.sendFile(indexHtmlVite, (err2) => {
				if (err2) {
					res.status(200).send("SPA not built yet. API is available under /api.");
				}
			});
		}
	});
});

// start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});


