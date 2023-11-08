/*
  Warnings:

  - Made the column `overtime` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `Attendance` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "overtime" SET NOT NULL,
ALTER COLUMN "overtime" SET DEFAULT '{ "hour" : 0, "minutes" : 0 }',
ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "end_time" SET DEFAULT '{ "hour" : 0, "minutes" : 0 }';
