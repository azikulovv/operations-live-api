-- CreateTable
CREATE TABLE "participant_debts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "participant_debts_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "event_participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_debts_participantId_key" ON "participant_debts"("participantId");
