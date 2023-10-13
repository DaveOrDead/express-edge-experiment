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
  if (!isAuthenticated) {
    res.redirect("/");
  } else {
    const profile = await kindeClient.getUserProfile(sessionManager);
    res.render("dashboard", {
      title: "Edge | Dashboard",
      isAuthenticated,
      given_name: profile.given_name,
      family_name: profile.family_name,
      picture: profile.picture,
    });
  }
});

export default router;
