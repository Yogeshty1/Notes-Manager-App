const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
	title: { type: String, default: "" },
	description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.models.Note || mongoose.model("Note", notesSchema);


