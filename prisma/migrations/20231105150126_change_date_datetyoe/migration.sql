/*
  Warnings:

  - The `end_time` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `start_time` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "start_time",
ADD COLUMN     "start_time" JSONB NOT NULL,
DROP COLUMN "end_time",
ADD COLUMN     "end_time" JSONB;
