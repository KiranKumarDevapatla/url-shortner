const express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const nanoid = require("nanoid");
const {
  createShortUrl,
  getAllShortUrls,
  getShortUrlByShortUrl,
} = require("./urlModel");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 3000;

const initializePassport = require("./passportConfig");

initializePassport(passport);


app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Home Page
app.get("/", (req, res) => {
  res.render("index");
});

// Registration Page
app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register.ejs");
});

// Login Page
app.get("/users/login", checkAuthenticated, (req, res) => {
  console.log(req.session.flash.error);
  res.render("login.ejs");
});

// Dashboard Page - Display user's short links
app.get("/users/dashboard", checkNotAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const shortUrls = await getAllShortUrls(userId);

    res.render("dashboard", {
      user: req.user.name,
      links: shortUrls,
      shortUrl: null,
    });
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Logout
app.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.render("index", { message: "You have logged out successfully" });
  });
});

// Registration
app.post("/users/register", async (req, res) => {
  
  res.send("Registration route");
});

// Login
app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

// URL Shortening
app.post("/shorten", checkNotAuthenticated, async (req, res) => {
  try {
    const fullUrl = req.body.fullUrl;
    const userId = req.user.id;

    const shortUrlData = await createShortUrl(fullUrl, userId);

    res.render("dashboard", {
      user: req.user.name,
      links: await getAllShortUrls(userId),
      shortUrl: shortUrlData.short_url,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;

  try {
    const shortUrlData = await getShortUrlByShortUrl(shortUrl);

    if (shortUrlData) {
      
      res.redirect(shortUrlData.full_url);
    } else {
      
      res.status(404).send("Short URL not found");
    }
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Internal Server Error");
  }
});


// Middleware Functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
