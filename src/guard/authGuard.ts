import { NextFunction, Request, Response } from "express";
import { getSession } from "../lib/sessionStore";

async function authGuard(req: Request, res: Response, next: NextFunction) {
  const cookieHeader = req.headers.cookie;
  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) ?? [],
  );

  const sessionId = cookies?.sessionId;

  if (!sessionId) {
    console.log("session id not found");

    return res.status(401).json({ message: "Unauthorized" });
  }
  const session = getSession(sessionId);

  if (!session) {
    console.log("session  not found");

    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = session.userId;
  next();
}
export default authGuard;
