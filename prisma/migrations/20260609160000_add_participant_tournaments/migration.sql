-- CreateTable
CREATE TABLE "participant_tournaments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "reEntry" INTEGER NOT NULL DEFAULT 0,
    "addon" INTEGER NOT NULL DEFAULT 0,
    "knockouts" INTEGER NOT NULL DEFAULT 0,
    "bustoutOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "participant_tournaments_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "event_participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_tournaments_participantId_key" ON "participant_tournaments"("participantId");
