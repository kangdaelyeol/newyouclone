import User from "../models/User";
import Video from "../models/video";
import Comment from "../models/Comment";
// globalRouter
export const search = async (req, res) => {
  let videos = [];
  const { keyword } = req.query;
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  res.render("search", { pagetitle: "searchVideo", videos });
};

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createAt: "desc" })
      .populate("owner");
    return res.render("home", { pagetitle: "home", videos });
  } catch (error) {
    return res.send(error);
  }
};

// videoRouter
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = await Video.findById(id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  if (!video) return res.render("404");
  res.render("edit", { pagetitle: "edit: " + video.title, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) return res.render("404");
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashTags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/`);
};

export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comment"); // findOne({...})
  if (!video) res.redirect("/");
  return res.render("watch", { pagetitle: video.title, video });
};
export const getUpload = (req, res) =>
  res.render("upload", { pagetitle: "uploadVideo" });

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  try {
    const newvideo = await Video.create({
      title,
      description,
      videoUrl: video[0].path,
      thumbUrl: thumb[0].path,
      hashTags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newvideo);
    user.save();

    return res.redirect("/");
  } catch (error) {
    res.render("upload", { pagetitle: "uploadvideo", error: error._message });
  }
  // console.log(video);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.session.user;
  const video = Video.findById(id);
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(400);
  } else {
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
  }
};

export const enrollComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: video._id,
  });
  video.comment.push(comment._id);
  await video.save();
  return res.status(201).json({ commentId: comment._id });
};

export const deleteComment = async (req, res) => {
  let j;
  const { user } = req.session;
  const { deleteId } = req.body;
  const comment = await Comment.findById(deleteId);
  if (String(user._id) !== String(comment.owner)) return res.sendStatus(404);
  const videoId = comment.video;
  const video = await Video.findById(videoId);

  for(let i = 0; i < video.comment.length; i++){
    if(String(video.comment[i]._id) === String(deleteId)) j = i;
  }
  video.comment.splice(j, 1);

  await Comment.findByIdAndDelete(deleteId);
  await video.save();
  return res.sendStatus(201);
};
