-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_zapId_fkey";

-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "zapId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_zapId_fkey" FOREIGN KEY ("zapId") REFERENCES "Zap"("id") ON DELETE SET NULL ON UPDATE CASCADE;
