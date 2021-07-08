import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true },
  createAt: { type: Date, default: Date.now, required: true },
  hashTags: [{ type: String }], // ["#ad", "bb", ...]
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbUrl: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

videoSchema.static("formatHashtags", (hashTags) => {
  return hashTags.split(",").map((s) => (s.startsWith("#") ? s : `#${s}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
