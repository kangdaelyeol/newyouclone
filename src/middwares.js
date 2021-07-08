import multer from "multer"

export const localsMiddware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.login = Boolean(req.session.login);
    res.locals.loginUser = req.session.user || {};
    next();
}

export const protectedMiddleware = (req, res, next) =>{
    if(req.session.login){
        return next();
    } else {
        req.flash("info", "Not info authorized");
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.login){
        return next();
    } else {
        req.flash("error", "Not authorized");
        res.redirect("/");
    }
}

export const uploadAvatar = multer({
    dest:"uploads/avatar/",
    limits:{
        fileSize: 3000000
    }
});

export const uploadVideo = multer({
    dest: "uploads/video/",
    limits: {
        fileSize: 10000000
    }
})