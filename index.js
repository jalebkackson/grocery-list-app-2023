// require's/setup
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Item = require("./models/item");
const methodOverride = require("method-override");
const dbUrl = process.env.DB_URL;

// mongoose boiler
main().catch((err) => {
  console.log("OH NO MONGO ERROR!!!");
  console.log(err);
});

// mongodb url "mongodb://127.0.0.1:27017/groceryApp"
async function main() {
  await mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Mongo Connection OPEN!!!");
    });
}

// express boiler
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// static files (css)
app.use(express.static(path.join(__dirname, "public")));
// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// main page
app.get("/", async (req, res) => {
  const items = await Item.find({});
  res.render("items/index.ejs", { items });
});

// add input to db
app.post("/", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.redirect("/");
});

// handle delete buttons
app.delete("/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
