/*
  Warnings:

  - The values [DELETED] on the enum `ParticipantStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ParticipantStatus_new" AS ENUM ('ACTIVE', 'REVOKED');
ALTER TABLE "public"."participants" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "participants" ALTER COLUMN "status" TYPE "ParticipantStatus_new" USING ("status"::text::"ParticipantStatus_new");
ALTER TYPE "ParticipantStatus" RENAME TO "ParticipantStatus_old";
ALTER TYPE "ParticipantStatus_new" RENAME TO "ParticipantStatus";
DROP TYPE "public"."ParticipantStatus_old";
ALTER TABLE "participants" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "revokedAt" TIMESTAMP(3);
