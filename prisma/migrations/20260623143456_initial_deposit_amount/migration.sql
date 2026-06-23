/*
  Warnings:

  - You are about to drop the column `initialPaymentAmount` on the `event_participants` table. All the data in the column will be lost.
  - You are about to drop the column `initialPaymentAmount` on the `events` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event_participants" (
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
    "badge" TEXT,
    "initialDepositAmount" INTEGER NOT NULL DEFAULT 0,
    "arrived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event_participants" ("arrived", "badge", "cancelledAt", "createdAt", "eventId", "externalId", "externalUserId", "id", "position", "registeredAt", "seatNumber", "status", "tableNumber", "updatedAt", "userAvatarUrl", "userEmail", "userName", "userPhone", "userTelegramId") SELECT "arrived", "badge", "cancelledAt", "createdAt", "eventId", "externalId", "externalUserId", "id", "position", "registeredAt", "seatNumber", "status", "tableNumber", "updatedAt", "userAvatarUrl", "userEmail", "userName", "userPhone", "userTelegramId" FROM "event_participants";
DROP TABLE "event_participants";
ALTER TABLE "new_event_participants" RENAME TO "event_participants";
CREATE UNIQUE INDEX "event_participants_externalId_key" ON "event_participants"("externalId");
CREATE INDEX "event_participants_eventId_idx" ON "event_participants"("eventId");
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gameType" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "status" TEXT NOT NULL,
    "participantLimit" INTEGER,
    "initialDepositAmount" INTEGER NOT NULL DEFAULT 0,
    "seatsPerTable" INTEGER,
    "tableCount" INTEGER NOT NULL,
    "registrationsCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_events" ("address", "city", "createdAt", "endsAt", "externalId", "gameType", "id", "participantLimit", "registrationsCount", "seatsPerTable", "startsAt", "status", "tableCount", "title", "updatedAt") SELECT "address", "city", "createdAt", "endsAt", "externalId", "gameType", "id", "participantLimit", "registrationsCount", "seatsPerTable", "startsAt", "status", "tableCount", "title", "updatedAt" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE UNIQUE INDEX "events_externalId_key" ON "events"("externalId");
CREATE INDEX "events_status_startsAt_idx" ON "events"("status", "startsAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
