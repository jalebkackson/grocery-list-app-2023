const mongoose = require("mongoose");

// define schema
const itemSchema = new mongoose.Schema({
  listItem: {
    type: String,
    require: true,
  },
  order: Number,
});

// pre middleware to assign item index on creation
itemSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      // find item with highest order
      const highestOrderItem = await Item.findOne().sort("-order");

      // set the order for the new item
      this.order = highestOrderItem ? highestOrderItem.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// define model based on schema
const Item = mongoose.model("Item", itemSchema);

// export Product model
module.exports = Item;
