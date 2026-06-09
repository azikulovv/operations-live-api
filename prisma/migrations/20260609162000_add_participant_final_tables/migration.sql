-- CreateTable
CREATE TABLE "participant_final_tables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "seat" INTEGER NOT NULL,
    "stack" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "participant_final_tables_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "participant_final_tables_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "event_participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_final_tables_participantId_key" ON "participant_final_tables"("participantId");

-- CreateIndex
CREATE INDEX "participant_final_tables_eventId_idx" ON "participant_final_tables"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "participant_final_tables_eventId_seat_key" ON "participant_final_tables"("eventId", "seat");
