-- CreateTable
CREATE TABLE "event_participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "registeredAt" DATETIME NOT NULL,
    "cancelledAt" DATETIME,
    "position" INTEGER,
    "tableNumber" INTEGER,
    "seatNumber" INTEGER,
    "userName" TEXT,
    "userEmail" TEXT,
    "userPhone" TEXT,
    "userTelegramId" TEXT,
    "userAvatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "event_participants_externalId_key" ON "event_participants"("externalId");

-- CreateIndex
CREATE INDEX "event_participants_eventId_idx" ON "event_participants"("eventId");
