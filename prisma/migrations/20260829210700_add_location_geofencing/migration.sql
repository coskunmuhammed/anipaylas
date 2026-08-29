-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "geofenceRadiusMeters" INTEGER DEFAULT 2500,
ADD COLUMN     "locationVerificationEnabled" BOOLEAN NOT NULL DEFAULT false;
