-- AlterTable: remove status from TimeEntry
ALTER TABLE "TimeEntry" DROP COLUMN "status";

-- DropEnum
DROP TYPE "TimeEntryStatus";

-- CreateEnum
CREATE TYPE "WeeklyTimesheetStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "WeeklyTimesheet" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "status" "WeeklyTimesheetStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyTimesheet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeeklyTimesheet" ADD CONSTRAINT "WeeklyTimesheet_employeeId_fkey"
    FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateUniqueIndex
CREATE UNIQUE INDEX "WeeklyTimesheet_employeeId_weekStart_key" ON "WeeklyTimesheet"("employeeId", "weekStart");
