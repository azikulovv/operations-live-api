-- CreateTable
CREATE TABLE "event_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "cancelledAt" DATETIME,
    "position" INTEGER,
    "tableNumber" INTEGER NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "userAvatarUrl" TEXT,
    "userAvatarHash" TEXT,
    "userEmail" TEXT NOT NULL,
    "userUsername" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "userRole" TEXT NOT NULL,
    "userCreatedAt" DATETIME NOT NULL,
    "userUpdatedAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "event_participants_externalId_key" ON "event_participants"("externalId");

-- CreateIndex
CREATE INDEX "event_participants_eventId_idx" ON "event_participants"("eventId");
