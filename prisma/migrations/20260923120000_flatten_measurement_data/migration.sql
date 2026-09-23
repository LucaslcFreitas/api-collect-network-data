-- Add the 1:1 measurement fields before removing their separate tables.
ALTER TABLE "measurements"
ADD COLUMN "latitude" DOUBLE PRECISION,
ADD COLUMN "longitude" DOUBLE PRECISION,
ADD COLUMN "altitude" DOUBLE PRECISION,
ADD COLUMN "accuracy" DOUBLE PRECISION,
ADD COLUMN "altitudeAccuracy" DOUBLE PRECISION,
ADD COLUMN "speed" DOUBLE PRECISION,
ADD COLUMN "heading" DOUBLE PRECISION,
ADD COLUMN "accelerometerX" DOUBLE PRECISION,
ADD COLUMN "accelerometerY" DOUBLE PRECISION,
ADD COLUMN "accelerometerZ" DOUBLE PRECISION,
ADD COLUMN "gyroscopeX" DOUBLE PRECISION,
ADD COLUMN "gyroscopeY" DOUBLE PRECISION,
ADD COLUMN "gyroscopeZ" DOUBLE PRECISION,
ADD COLUMN "servingRegistered" BOOLEAN,
ADD COLUMN "servingTechnology" TEXT,
ADD COLUMN "servingCellId" BIGINT,
ADD COLUMN "servingPci" INTEGER,
ADD COLUMN "servingTac" INTEGER,
ADD COLUMN "servingArfcn" INTEGER,
ADD COLUMN "servingMcc" TEXT,
ADD COLUMN "servingMnc" TEXT,
ADD COLUMN "servingRsrp" DOUBLE PRECISION,
ADD COLUMN "servingRsrq" DOUBLE PRECISION,
ADD COLUMN "servingRssi" DOUBLE PRECISION,
ADD COLUMN "servingSinr" DOUBLE PRECISION,
ADD COLUMN "servingTimingAdvance" INTEGER;

UPDATE "measurements" AS measurement
SET
    "latitude" = location."latitude",
    "longitude" = location."longitude",
    "altitude" = location."altitude",
    "accuracy" = location."accuracy",
    "altitudeAccuracy" = location."altitudeAccuracy",
    "speed" = location."speed",
    "heading" = location."heading"
FROM "locations" AS location
WHERE location."measurementId" = measurement."id";

UPDATE "measurements" AS measurement
SET
    "accelerometerX" = motion."accelerometerX",
    "accelerometerY" = motion."accelerometerY",
    "accelerometerZ" = motion."accelerometerZ",
    "gyroscopeX" = motion."gyroscopeX",
    "gyroscopeY" = motion."gyroscopeY",
    "gyroscopeZ" = motion."gyroscopeZ"
FROM "motion" AS motion
WHERE motion."measurementId" = measurement."id";

UPDATE "measurements" AS measurement
SET
    "servingRegistered" = serving."registered",
    "servingTechnology" = serving."technology",
    "servingCellId" = serving."cellId",
    "servingPci" = serving."pci",
    "servingTac" = serving."tac",
    "servingArfcn" = serving."arfcn",
    "servingMcc" = serving."mcc",
    "servingMnc" = serving."mnc",
    "servingRsrp" = serving."rsrp",
    "servingRsrq" = serving."rsrq",
    "servingRssi" = serving."rssi",
    "servingSinr" = serving."sinr",
    "servingTimingAdvance" = serving."timingAdvance"
FROM "serving_cells" AS serving
WHERE serving."measurementId" = measurement."id";

DROP TABLE "locations";
DROP TABLE "motion";
DROP TABLE "serving_cells";