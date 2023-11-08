/*
  Warnings:

  - You are about to drop the column `googleId` on the `UserLogin` table. All the data in the column will be lost.
  - Made the column `overtime` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `UserLogin` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "UserLogin_googleId_key";

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "overtime" SET NOT NULL,
ALTER COLUMN "overtime" SET DEFAULT '{ "hour" : 0, "minutes" : 0 }';

-- AlterTable
ALTER TABLE "UserLogin" DROP COLUMN "googleId",
ALTER COLUMN "password" SET NOT NULL;
