import { prisma } from "../db";
import { Request, Response } from "express";
import { createSession } from "../lib/sessionStore";

async function login(req: Request, res: Response) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const user = await prisma.user.findFirst({
    where: {
      name: name as string,
    },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const sessionId = createSession(user.id);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json(user);
}
export default login;
