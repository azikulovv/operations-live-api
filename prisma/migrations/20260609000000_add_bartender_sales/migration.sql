-- CreateTable
CREATE TABLE "participant_bartender_sales" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "participant_bartender_sales_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "event_participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "participant_bartender_sales_participantId_key" ON "participant_bartender_sales"("participantId");
