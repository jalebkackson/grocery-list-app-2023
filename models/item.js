const mongoose = require("mongoose");

// define schema
const itemSchema = new mongoose.Schema({
  listItem: {
    type: String,
    require: true,
  },
});

// define model based on schema
const Item = mongoose.model("Item", itemSchema);

// export Product model
module.exports = Item;
