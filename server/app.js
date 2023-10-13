import createError from "http-errors";
import express from "express";
import expressLayouts from "express-ejs-layouts";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import dashboardRouter from "./routes/dashboard";
import { ironSessionManager, ironSessionOptions } from "./sessionManager/index";
import { kindeClient } from "./kindeClient/index";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();

// view engine setup
app.use(expressLayouts);
app.set("layout", "./layouts/full-width");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/login", async (req, res) => {
  const sessionManager = await ironSessionManager(req, res, ironSessionOptions);
  const loginUrl = await kindeClient.login(sessionManager);
  return res.redirect(loginUrl.toString());
});

app.get("/register", async (req, res) => {
  const sessionManager = await ironSessionManager(req, res, ironSessionOptions);
  const registerUrl = await kindeClient.register(sessionManager);
  return res.redirect(registerUrl.toString());
});

app.get("/logout", async (req, res) => {
  const sessionManager = await ironSessionManager(req, res, ironSessionOptions);
  const logoutUrl = await kindeClient.logout(sessionManager);
  return res.redirect(logoutUrl.toString());
});

app.get("/callback", async (req, res) => {
  const sessionManager = await ironSessionManager(req, res, ironSessionOptions);
  const url = new URL(`${req.protocol}://${req.get("host")}${req.url}`);
  await kindeClient.handleRedirectToApp(sessionManager, url);
  return res.redirect("/");
});

app.use("/", indexRouter);
app.use("/dashboard", dashboardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export { app, kindeClient };
