import express from "express";
import "dotenv/config";
import login from "./controllers/login";
import register from "./controllers/register";
import authGuard from "./guard/authGuard";
import {
  getGameLeaderboard,
  getGlobalLeaderboard,
  submitScoreController,
} from "./controllers/score";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use(express.json());

app.post("/login", login);
app.post("/register", register);
app.post("/score/:gameId", authGuard, submitScoreController);
app.get("/leaderboard/:gameId", authGuard, getGameLeaderboard);
app.get("/leaderboard/global", authGuard, getGlobalLeaderboard);
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
