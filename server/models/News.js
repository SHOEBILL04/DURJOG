import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String }
}, { timestamps: true });

export default mongoose.model("News", newsSchema);