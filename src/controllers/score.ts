import { Request, Response } from "express";
import prisma from "../db";
import { redisClient } from "../redis-client";

export async function submitScoreController(req: Request, res: Response) {
  const { gameId } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const { score } = req.body;
  const game = await prisma.game.findFirst({
    where: {
      id: parseInt(gameId as string),
    },
  });
  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  const existingScore = await prisma.score.findFirst({
    where: {
      user_id: userId!,
      game_id: parseInt(gameId as string),
    },
  });
  if (existingScore) {
    await prisma.score.update({
      where: {
        id: existingScore.id,
      },
      data: {
        score: existingScore.score + score,
      },
    });
  } else {
    await prisma.score.create({
      data: {
        user_id: userId!,
        score: score,
        game_id: parseInt(gameId as string),
      },
    });
  }

  // submit score on redis
  const scoreKey = `leaderboard:${gameId}`;
  const currentScore = await redisClient.zScore(scoreKey, userId?.toString());
  const newScore = currentScore ? currentScore + score : score;

  await redisClient.zAdd(scoreKey, {
    score: newScore,
    value: userId?.toString(),
  });
  const globalLeaderboardKey = "leaderboard:global";
  const globalCurrentScore = await redisClient.zScore(
    globalLeaderboardKey,
    userId?.toString(),
  );
  const globalNewScore = globalCurrentScore
    ? globalCurrentScore + score
    : score;
  await redisClient.zAdd(globalLeaderboardKey, {
    score: globalNewScore,
    value: userId?.toString(),
  });

  return res.json(newScore);
}
export async function getGameLeaderboard(req: Request, res: Response) {
  const { gameId } = req.params;
  const scoreKey = `leaderboard:${gameId}`;
  const leaderboard = await redisClient.zRangeWithScores(scoreKey, 0, -1);
  if (leaderboard.length > 0) {
    const userIds = leaderboard.map((score) => score.value);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds.map((id) => parseInt(id)),
        },
      },
    });
    const response = leaderboard.map((score) => {
      const user = users.find((user) => user.id.toString() === score.value);

      return {
        user,
        score: score.score,
      };
    });
    res.setHeader("X-Cache", "HIT");
    return res.json(response);
  }
  res.setHeader("X-Cache", "MISS");
  const scores = await prisma.score.findMany({
    where: {
      game_id: parseInt(gameId as string),
    },
    select: {
      score: true,
      user: true,
    },
    orderBy: {
      score: "desc",
    },
  });
  scores.forEach((score) => {
    redisClient.zAdd(scoreKey, {
      score: score.score,
      value: score.user.id.toString(),
    });
  });
  return res.json(scores);
}
export async function getGlobalLeaderboard(req: Request, res: Response) {
  const globalLeaderboardKey = "leaderboard:global";
  const leaderboard = await redisClient.zRangeWithScores(
    globalLeaderboardKey,
    0,
    -1,
  );
  if (leaderboard.length > 0) {
    const userIds = leaderboard.map((score) => score.value);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds.map((id) => parseInt(id)),
        },
      },
    });
    const response = leaderboard.map((score) => {
      const user = users.find((user) => user.id.toString() === score.value);
      return {
        user,
        score: score.score,
      };
    });
    res.setHeader("X-Cache", "HIT");
    return res.json(response);
  }
  res.setHeader("X-Cache", "MISS");
  const scores = await prisma.score.findMany({
    select: {
      score: true,
      user: true,
    },
    orderBy: {
      score: "desc",
    },
  });
  scores.forEach((score) => {
    redisClient.zAdd(globalLeaderboardKey, {
      score: score.score,
      value: score.user.id.toString(),
    });
  });
  return res.json(scores);
}
