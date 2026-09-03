/*
  Warnings:

  - A unique constraint covering the columns `[participantId,clientBatchId]` on the table `batches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientBatchId` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "batches" ADD COLUMN     "clientBatchId" VARCHAR(64) NOT NULL;

-- CreateIndex
CREATE INDEX "batches_receivedAt_idx" ON "batches"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "batches_participantId_clientBatchId_key" ON "batches"("participantId", "clientBatchId");
