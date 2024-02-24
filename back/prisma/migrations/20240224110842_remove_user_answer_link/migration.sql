/*
  Warnings:

  - You are about to drop the column `userId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `socketId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "userId",
ADD COLUMN     "socketId" TEXT NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL;
