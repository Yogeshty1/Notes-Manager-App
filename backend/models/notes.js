const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// a note has a title and some text
const notesSchema = new Schema({
	title: {
		type: String,
		required: false,
		default: ""
	},
	description: {
		type: String,
		required: false,
		default: ""
	}
}, { timestamps: true });

const Note = mongoose.model("Note", notesSchema);
module.exports = Note;


