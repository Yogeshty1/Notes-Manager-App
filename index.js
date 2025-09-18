const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const MONGO_URL = "mongodb://127.0.0.1:27017/Notes_Manager";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));




//view route
app.get("/", async (req, res) => {
const notes = await notes.find({});
res.render("main.ejs", { allnotes });
});



//create route
//edit route
// delete route


app.listen(8080, () => {
console.log("server is listening to port 8080");
});

