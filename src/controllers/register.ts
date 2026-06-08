import { prisma } from "../db";
import { Request, Response } from "express";
import { createSession } from "../lib/sessionStore";

async function register(req: Request, res: Response) {
  const { name } = req.body;
  const user = await prisma.user.create({
    data: {
      name: name,
      role: "USER",
    },
  });
  const sessionId = createSession(user.id);

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json(user);
}
export default register;
