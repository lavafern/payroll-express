-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "overtime" DROP NOT NULL,
ALTER COLUMN "overtime" DROP DEFAULT,
ALTER COLUMN "end_time" SET DEFAULT '{ "hour" : 17, "minutes" : 0 }';
