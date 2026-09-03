/*
  Warnings:

  - You are about to drop the column `receivedAt` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_participantId_fkey";

-- DropIndex
DROP INDEX "batches_receivedAt_idx";

-- DropIndex
DROP INDEX "batches_sessionId_idx";

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "receivedAt",
DROP COLUMN "sessionId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "appVersion" TEXT,
ADD COLUMN     "deviceModel" TEXT,
ADD COLUMN     "os" TEXT;

-- DropTable
DROP TABLE "sessions";

-- CreateIndex
CREATE INDEX "batches_createdAt_idx" ON "batches"("createdAt");
