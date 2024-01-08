import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  id: String,
  products: [
    {
      product: String,
      quantity: Number,
    },
  ],
});

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel
