-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "measurementId" UUID NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "altitudeAccuracy" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "heading" DOUBLE PRECISION,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- Migrate existing location data before removing the old columns.
INSERT INTO "locations" (
    "id",
    "measurementId",
    "latitude",
    "longitude",
    "altitude",
    "accuracy",
    "altitudeAccuracy",
    "speed",
    "heading"
)
SELECT
    gen_random_uuid(),
    "id",
    "latitude",
    "longitude",
    "altitude",
    "accuracy",
    "altitudeAccuracy",
    "speed",
    "heading"
FROM "measurements";

-- AlterTable
ALTER TABLE "locations" ADD CONSTRAINT "locations_measurementId_key" UNIQUE ("measurementId");
ALTER TABLE "locations" ADD CONSTRAINT "locations_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "measurements"
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "altitude",
DROP COLUMN "accuracy",
DROP COLUMN "altitudeAccuracy",
DROP COLUMN "speed",
DROP COLUMN "heading";