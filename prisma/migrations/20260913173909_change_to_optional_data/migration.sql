-- AlterTable
ALTER TABLE "measurements" ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "neighboring_cells" ALTER COLUMN "registered" DROP NOT NULL,
ALTER COLUMN "technology" DROP NOT NULL;

-- AlterTable
ALTER TABLE "serving_cells" ALTER COLUMN "registered" DROP NOT NULL,
ALTER COLUMN "technology" DROP NOT NULL;
