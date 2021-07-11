import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const s3ImageUploader = multerS3({
  s3: s3,
  bucket: "eodufxbqmUploader/images",
  acl: "public-read",
});

const s3VideoUploader = multerS3({
  s3: s3,
  bucket: "eodufxbqmUploader/videos",
  acl: "public-read",
});

export const localsMiddware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.login = Boolean(req.session.login);
  res.locals.loginUser = req.session.user || {};
  res.locals.isHeroku = process.env.NODE_ENV === "production";
  next();
};

export const protectedMiddleware = (req, res, next) => {
  if (req.session.login) {
    return next();
  } else {
    req.flash("info", "Not info authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.login) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    res.redirect("/");
  }
};

const isHeroku = process.env.NODE_ENV === "production";

export const uploadAvatar = multer({
  dest: "uploads/avatar/",
  limits: {
    fileSize: 3000000,
  },
  storage: isHeroku ? s3ImageUploader : undefined,
});

export const uploadVideo = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? s3VideoUploader : undefined,
});
