-- CreateEnum
CREATE TYPE "KitStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Kit" ADD COLUMN     "status" "KitStatus" NOT NULL DEFAULT 'PUBLISHED';

-- CreateIndex
CREATE INDEX "Kit_status_idx" ON "Kit"("status");
