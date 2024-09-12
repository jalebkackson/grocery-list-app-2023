// require's and setup
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Item = require("./models/item");
const methodOverride = require("method-override");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/groceryApp";
// mongoose boiler
main().catch((err) => {
  console.log("OH NO MONGO ERROR!!!");
  console.log(err);
});

// mongodb url
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
app.use(express.json());

// main page
app.get("/", async (req, res) => {
  const items = await Item.find({}).sort({ order: 1 });
  res.render("items/index.ejs", { items });
});

// route for sending json items to frontend
app.put("/update-items", async (req, res) => {
  const { updatedOrder } = req.body;
  console.log(updatedOrder);

  // Check if req.body is defined and contains the updatedOrder
  if (!updatedOrder) {
    return res.status(400).json({ message: "Invalid data received" });
  }

  try {
    // Iterate over updatedOrder and update items in the database
    for (const item of updatedOrder) {
      await Item.findOneAndUpdate(
        { listItem: item.name },
        { order: item.order }
      );
    }
    const updatedList = await Item.find({});
    console.log(updatedList);
    res.status(200).json({ message: "Order updated successfully - index.js" });
  } catch (error) {
    console.error("Error updating order: -index.js", error);
    res.status(500).json({ message: "Failed to update order - index.js" });
  }
});

// add input to db
app.post("/", async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.redirect("/");
});

// handle delete buttons
app.delete("/:id", async (req, res) => {
  // store item id when delete is clicked
  const itemId = req.params.id;
  const itemToRemove = await Item.findById(itemId); // find item to delete
  const orderValue = itemToRemove.order; // store the order value of item
  await Item.findByIdAndDelete(itemId); // delete item

  // update orders
  await Item.updateMany(
    { order: { $gt: orderValue } }, // find all items with index greater than deleted item
    { $inc: { order: -1 } } // decrease order of each by 1
  );
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

async function docCount() {
  const num = await Item.countDocuments();
  const docs = await Item.find();
  console.log(num);
  console.log(docs);
}
docCount();
