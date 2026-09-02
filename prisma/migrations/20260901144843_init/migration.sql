-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('ACTIVE', 'REVOKED', 'DELETED');

-- CreateTable
CREATE TABLE "participants" (
    "id" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "status" "ParticipantStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "appVersion" TEXT,
    "deviceModel" TEXT,
    "os" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" UUID NOT NULL,
    "participantId" UUID NOT NULL,
    "sessionId" UUID,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measurementCount" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measurements" (
    "id" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "altitudeAccuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,

    CONSTRAINT "measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motion" (
    "id" UUID NOT NULL,
    "measurementId" UUID NOT NULL,
    "accelerometerX" DOUBLE PRECISION,
    "accelerometerY" DOUBLE PRECISION,
    "accelerometerZ" DOUBLE PRECISION,
    "gyroscopeX" DOUBLE PRECISION,
    "gyroscopeY" DOUBLE PRECISION,
    "gyroscopeZ" DOUBLE PRECISION,

    CONSTRAINT "motion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serving_cells" (
    "id" UUID NOT NULL,
    "measurementId" UUID NOT NULL,
    "registered" BOOLEAN NOT NULL,
    "technology" TEXT NOT NULL,
    "cellId" BIGINT,
    "pci" INTEGER,
    "tac" INTEGER,
    "arfcn" INTEGER,
    "mcc" TEXT,
    "mnc" TEXT,
    "rsrp" DOUBLE PRECISION,
    "rsrq" DOUBLE PRECISION,
    "rssi" DOUBLE PRECISION,
    "sinr" DOUBLE PRECISION,

    CONSTRAINT "serving_cells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neighboring_cells" (
    "id" UUID NOT NULL,
    "measurementId" UUID NOT NULL,
    "registered" BOOLEAN NOT NULL,
    "technology" TEXT NOT NULL,
    "cellId" BIGINT,
    "pci" INTEGER,
    "tac" INTEGER,
    "arfcn" INTEGER,
    "mcc" TEXT,
    "mnc" TEXT,
    "rsrp" DOUBLE PRECISION,
    "rsrq" DOUBLE PRECISION,
    "rssi" DOUBLE PRECISION,
    "sinr" DOUBLE PRECISION,

    CONSTRAINT "neighboring_cells_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participants_tokenHash_key" ON "participants"("tokenHash");

-- CreateIndex
CREATE INDEX "sessions_participantId_idx" ON "sessions"("participantId");

-- CreateIndex
CREATE INDEX "batches_participantId_idx" ON "batches"("participantId");

-- CreateIndex
CREATE INDEX "batches_sessionId_idx" ON "batches"("sessionId");

-- CreateIndex
CREATE INDEX "measurements_batchId_idx" ON "measurements"("batchId");

-- CreateIndex
CREATE INDEX "measurements_measuredAt_idx" ON "measurements"("measuredAt");

-- CreateIndex
CREATE UNIQUE INDEX "motion_measurementId_key" ON "motion"("measurementId");

-- CreateIndex
CREATE UNIQUE INDEX "serving_cells_measurementId_key" ON "serving_cells"("measurementId");

-- CreateIndex
CREATE INDEX "neighboring_cells_measurementId_idx" ON "neighboring_cells"("measurementId");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motion" ADD CONSTRAINT "motion_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serving_cells" ADD CONSTRAINT "serving_cells_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neighboring_cells" ADD CONSTRAINT "neighboring_cells_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
