-- CreateTable
CREATE TABLE "event_tables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "playersCount" INTEGER NOT NULL DEFAULT 0,
    "maxPlayers" INTEGER NOT NULL DEFAULT 9,
    "status" TEXT NOT NULL DEFAULT 'NOT_USED',
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_tables_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "event_tables_eventId_idx" ON "event_tables"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_tables_eventId_tableNumber_key" ON "event_tables"("eventId", "tableNumber");
