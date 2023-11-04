/*
  Warnings:

  - Made the column `start_time` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "start_time" SET NOT NULL;
