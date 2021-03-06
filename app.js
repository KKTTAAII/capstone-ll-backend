"use strict";

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authShelterRoutes = require("./routes/authShelterRoutes");
const authAdopterRoutes = require("./routes/authAdopterRoutes");
const sheltersRoutes = require("./routes/sheltersRoutes");
const adoptersRoutes = require("./routes/adoptersRoutes");
const adoptableDogsRoutes = require("./routes/adoptableDogsRoutes");

const morgan = require("morgan");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(cors());
app.use(morgan("tiny"));
app.use(authenticateJWT);
//exclude these routes because it's for reset password without having to log in
// app.use(/\/((?!forgotPassword).)*/, authenticateJWT);
// app.use(/\/((?!resetForgotPassword).)*/, authenticateJWT);

app.use("/authShelter", authShelterRoutes);
app.use("/authAdopter", authAdopterRoutes);
app.use("/shelters", sheltersRoutes);
app.use("/adopters", adoptersRoutes);
app.use("/adoptableDogs", adoptableDogsRoutes);
app.use("/assets/", express.static("assets"));
app.use("/adopters/assets/", express.static("assets"));

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
