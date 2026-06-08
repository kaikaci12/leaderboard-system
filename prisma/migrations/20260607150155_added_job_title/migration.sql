/*
  Warnings:

  - You are about to drop the column `game_id` on the `score` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "score" DROP CONSTRAINT "score_game_id_fkey";

-- AlterTable
ALTER TABLE "score" DROP COLUMN "game_id";
