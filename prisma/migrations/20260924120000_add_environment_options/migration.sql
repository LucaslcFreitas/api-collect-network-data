CREATE TABLE "morphology" (
    "id" UUID NOT NULL,
    "environment" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "morphology_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "topography" (
    "id" UUID NOT NULL,
    "environment" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topography_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "morphology_environment_key" ON "morphology"("environment");
CREATE UNIQUE INDEX "topography_environment_key" ON "topography"("environment");