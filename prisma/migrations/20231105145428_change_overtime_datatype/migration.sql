/*
  Warnings:

  - You are about to drop the column `overtime_hours` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `overtime_minutes` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "overtime_hours",
DROP COLUMN "overtime_minutes",
ADD COLUMN     "overtime" JSONB;
