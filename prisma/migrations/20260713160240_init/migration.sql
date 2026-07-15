-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PLANNED', 'ACTIVE', 'CLOSED_FOR_UPLOAD', 'ALBUM_PREPARATION', 'READY_FOR_DOWNLOAD', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "PhotoStatus" AS ENUM ('UPLOADING', 'PROCESSING', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'DELETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PackageStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'DELETED');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "groomName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "welcomeTitle" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "uploadStartsAt" TIMESTAMP(3) NOT NULL,
    "uploadEndsAt" TIMESTAMP(3) NOT NULL,
    "moderationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "guestNameRequired" BOOLEAN NOT NULL DEFAULT false,
    "guestMessageEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maxPhotosPerGuest" INTEGER NOT NULL DEFAULT 50,
    "maxPhotoSizeBytes" INTEGER NOT NULL DEFAULT 15728640,
    "maxTotalPhotos" INTEGER NOT NULL DEFAULT 1000,
    "maxStorageBytes" INTEGER NOT NULL DEFAULT 10737418240,
    "currentPhotoCount" INTEGER NOT NULL DEFAULT 0,
    "currentStorageBytes" BIGINT NOT NULL DEFAULT 0,
    "archiveAt" TIMESTAMP(3),
    "deleteAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "guestName" TEXT,
    "guestMessage" TEXT,
    "originalUrl" TEXT NOT NULL,
    "galleryUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "status" "PhotoStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "isSelectedForDelivery" BOOLEAN NOT NULL DEFAULT false,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UploadSession" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "guestName" TEXT,
    "uploadedPhotoCount" INTEGER NOT NULL DEFAULT 0,
    "uploadedBytes" BIGINT NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QrScan" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QrScan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryPackage" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "PackageStatus" NOT NULL DEFAULT 'PENDING',
    "photoCount" INTEGER NOT NULL,
    "archiveStorageKey" TEXT,
    "archiveSizeBytes" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "DeliveryPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLink" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "deliveryPackageId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "passwordHash" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxDownloadCount" INTEGER NOT NULL DEFAULT 10,
    "currentDownloadCount" INTEGER NOT NULL DEFAULT 0,
    "lastDownloadedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "DownloadLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLog" (
    "id" TEXT NOT NULL,
    "downloadLinkId" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "userAgent" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "DownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsentLog" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "uploadSessionId" TEXT NOT NULL,
    "consentTextVersion" TEXT NOT NULL,
    "visitorHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_shortCode_key" ON "Event"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "UploadSession_sessionToken_key" ON "UploadSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadLink_tokenHash_key" ON "DownloadLink"("tokenHash");

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UploadSession" ADD CONSTRAINT "UploadSession_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QrScan" ADD CONSTRAINT "QrScan_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliveryPackage" ADD CONSTRAINT "DeliveryPackage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLink" ADD CONSTRAINT "DownloadLink_deliveryPackageId_fkey" FOREIGN KEY ("deliveryPackageId") REFERENCES "DeliveryPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DownloadLog" ADD CONSTRAINT "DownloadLog_downloadLinkId_fkey" FOREIGN KEY ("downloadLinkId") REFERENCES "DownloadLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsentLog" ADD CONSTRAINT "ConsentLog_uploadSessionId_fkey" FOREIGN KEY ("uploadSessionId") REFERENCES "UploadSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
