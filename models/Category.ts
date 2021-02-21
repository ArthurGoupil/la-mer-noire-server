import { Schema, model, Document } from "mongoose";

export interface Category extends Document {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const categoryModel = model<Category>("Category", categorySchema);

export default categoryModel;
