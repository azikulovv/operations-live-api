/*
  Warnings:

  - You are about to drop the column `seatsPerTable` on the `Event` table. All the data in the column will be lost.
  - Added the required column `registrationCount` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "features" TEXT NOT NULL DEFAULT '',
    "gameRules" TEXT NOT NULL DEFAULT '',
    "gameType" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "participantLimit" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "imageHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "registrationCount" INTEGER NOT NULL
);
INSERT INTO "new_Event" ("address", "city", "createdAt", "endsAt", "externalId", "features", "gameRules", "gameType", "id", "imageHash", "imageUrl", "participantLimit", "startsAt", "status", "title", "updatedAt") SELECT "address", "city", "createdAt", "endsAt", "externalId", "features", "gameRules", "gameType", "id", "imageHash", "imageUrl", "participantLimit", "startsAt", "status", "title", "updatedAt" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE UNIQUE INDEX "Event_externalId_key" ON "Event"("externalId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
