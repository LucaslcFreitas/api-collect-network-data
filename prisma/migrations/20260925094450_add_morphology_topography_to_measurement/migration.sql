ALTER TABLE "measurements" 
RENAME COLUMN "environment" TO "morphology";

ALTER TABLE "measurements" 
ADD COLUMN "topography" VARCHAR(100);