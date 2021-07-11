import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.s3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const awsUploader = multerS3({
  s3: s3,
  bucket: "eodufxbqmUploader",
  acl: "public-read",
});

export const localsMiddware = (req, res, next) => {
  res.locals.siteName = "Wetube";
  res.locals.login = Boolean(req.session.login);
  res.locals.loginUser = req.session.user || {};
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

export const uploadAvatar = multer({
  dest: "uploads/avatar/",
  limits: {
    fileSize: 3000000,
  },
  storage: awsUploader,
});

export const uploadVideo = multer({
  dest: "uploads/video/",
  limits: {
    fileSize: 10000000,
  },
  storage: awsUploader,
});
