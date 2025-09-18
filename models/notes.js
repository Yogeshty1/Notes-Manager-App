const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema({
description: {
    type: String,
    required: true,
},

// date: String,
});

const  note = mongoose.model("note", noteSchema);
module.exports = note;
