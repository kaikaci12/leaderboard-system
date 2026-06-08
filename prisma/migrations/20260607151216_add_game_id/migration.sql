/*
  Warnings:

  - Added the required column `game_id` to the `score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "score" ADD COLUMN     "game_id" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "score" ADD CONSTRAINT "score_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
