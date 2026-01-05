import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: String,
    hex: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true },
    brand: String,
    description: String,
    sizes: [String],
    colors: [colorSchema],
    image: String,

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// indexes
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });
productSchema.index({ vendor: 1 });

export default mongoose.model("Product", productSchema);
