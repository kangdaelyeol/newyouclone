import User from "../models/User";
import bcryptjs from "bcryptjs";
import fetch from "node-fetch";
import session from "express-session";
import Video from "../models/video";
// import session from "express-session";
// globalRouter

export const getJoin = (req, res) =>
  res.render("join", { pagetitle: "pagegogo" });
export const postJoin = async (req, res) => {
  const { username, email, password, password2, name, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pagetitle: "join",
      errormessage: "not match password!",
    });
  }
  const exist = await User.exists({ $or: [{ username }, { email }] });
  if (exist) {
    return res.status(400).render("join", {
      pagetitle: "join",
      errormessage: "This Username/email is already taken!",
    });
  }
  await User.create({
    username,
    email,
    password,
    name,
    location,
  });
  return res.redirect("/");
};

export const getLogin = (req, res) => {
  return res.render("login", { pagetitle: "login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pagetitle = "login";
  const userid = await User.findOne({ username, socialLogin: false });
  if (!userid) {
    return res.status(400).render("login", {
      pagetitle,
      errormessage: "This username does not exist!",
    });
  }
  const ok = await bcryptjs.compare(password, userid.password);
  console.log(userid.password);
  if (!ok) {
    return res
      .status(400)
      .render("login", { pagetitle, errormessage: "not matched password!" });
  }
  req.session.login = true;
  req.session.user = userid;
  return res.redirect("/");
};
// userRouter
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pagetitle: "not found user" });
  }
  return res.render("user/profile", {
    pagetitle: user.name,
    user,
  });
};
export const remove = (req, res) => res.send("remove");

// logout
export const logout = (req, res) => {
  req.session.destroy();
  console.log("afterLogout session: ", req.session);
  res.redirect("/");
};

// git Login API
export const gitLoginStart = (req, res) => {
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = `https://github.com/login/oauth/authorize?${params}`;
  res.redirect(baseUrl);
};

export const gitFinishLogin = async (req, res) => {
  const config = {
    client_id: process.env.CLIENT_ID,
    code: req.query.code,
    client_secret: process.env.CLIENT_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const baseUrl = "https://github.com/login/oauth/access_token";
  const FinalUrl = `${baseUrl}?${params}`;
  const accessUrl = "https://api.github.com";
  try {
    const tokenData = await (
      await fetch(FinalUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })
    ).json();

    if ("access_token" in tokenData) {
      const { access_token } = tokenData;
      const userData = await (
        await fetch(`${accessUrl}/user`, {
          // GET METHOD경우 생략
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
      const emailData = await (
        await fetch(`${accessUrl}/user/emails`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();

      // console.log(userData);
      // console.log(emailData);
      const email = emailData.find(
        (e) => e.primary === true && e.verified === true,
      );
      // console.log(email);
      let ifLocalUser = await User.findOne({ email: email.email });
      console.log(ifLocalUser);
      if (!ifLocalUser) {
        ifLocalUser = await User.create({
          username: userData.name,
          avatarUrl: userData.avatar_url,
          email: email.email,
          password: "",
          name: userData.login,
          location: userData.location,
          socialLogin: true,
        });
      }
      req.session.login = true;
      req.session.user = ifLocalUser;
      return res.redirect("/");
    }
  } catch (e) {
    console.log(e);
  }
};

export const getEditProfile = (req, res) => {
  return res.render("edit-profile", { pagetitle: "edit_Profile" });
};

export const postEditProfile = async (req, res) => {
  const {
    session: {
      user: { _id, email: curemail, username: curusername, avatarUrl },
    },
    body: { email, username, name, location },
    file,
  } = req;
  console.log(file);

  let editparams = [];

  if (curemail !== email) editparams.push({ email });
  if (curusername !== username) editparams.push({ username });

  if (editparams.length > 0) {
    const duplicateUserData = await User.exists({ $or: editparams });
    if (duplicateUserData) return res.redirect("/");
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      email,
      username,
      name,
      location,
      avatarUrl: file ? file.location : avatarUrl,
    },
    { new: true },
  );

  req.session.user = updateUser;

  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialLogin === true) return res.redirect("/");
  return res.render("user/change-password", { pagetitle: "Change-Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: { user: _id },
    body: { oldpw, newpw, checknewpw },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcryptjs.compare(oldpw, user.password);
  if (!ok || newpw !== checknewpw) {
    return res.status(400).render("user/change-password", {
      pagetitle: "Change-Password",
      errormessage: "this password is not match",
    });
  }
  console.log("oldpassword", user.password);
  user.password = newpw;
  await user.save();
  return res.redirect("/user/logout");
};
