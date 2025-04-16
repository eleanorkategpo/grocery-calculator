import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const grocerySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {  
    type: Date,
  },
  checkoutDate: {
    type: Date,
    default: null,
  },
});

const Grocery = mongoose.model("Grocery", grocerySchema);

export default Grocery;
