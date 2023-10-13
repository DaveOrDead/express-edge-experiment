import express from "express";
import {
  ironSessionManager,
  ironSessionOptions,
} from "../sessionManager/index";
import { kindeClient } from "../kindeClient/index";

var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const sessionManager = await ironSessionManager(req, res, ironSessionOptions);
  const isAuthenticated = await kindeClient.isAuthenticated(sessionManager); // Boolean: true or false
  if (isAuthenticated) {
    res.redirect("/dashboard");
  } else {
    res.render("index", { title: "Edge", isAuthenticated });
  }
});

export default router;
