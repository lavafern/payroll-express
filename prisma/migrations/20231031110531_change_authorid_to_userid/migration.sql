/*
  Warnings:

  - You are about to drop the column `authorId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Payroll` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `UserLogin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserLogin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payroll` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserLogin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Payroll" DROP CONSTRAINT "Payroll_authorId_fkey";

-- DropForeignKey
ALTER TABLE "UserLogin" DROP CONSTRAINT "UserLogin_authorId_fkey";

-- DropIndex
DROP INDEX "UserLogin_authorId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payroll" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserLogin" DROP COLUMN "authorId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserLogin_userId_key" ON "UserLogin"("userId");

-- AddForeignKey
ALTER TABLE "UserLogin" ADD CONSTRAINT "UserLogin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
