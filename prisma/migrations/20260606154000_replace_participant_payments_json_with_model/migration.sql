-- AlterTable
ALTER TABLE "event_participants" DROP COLUMN "payments";

-- CreateTable
CREATE TABLE "event_participant_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "tournament" INTEGER NOT NULL DEFAULT 0,
    "bar" INTEGER NOT NULL DEFAULT 0,
    "games" INTEGER NOT NULL DEFAULT 0,
    "paid" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_participant_payments_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "event_participants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Backfill existing participants with default payment values.
INSERT INTO "event_participant_payments" (
    "id",
    "participantId",
    "tournament",
    "bar",
    "games",
    "paid",
    "createdAt",
    "updatedAt"
)
SELECT
    'payment_' || "id",
    "id",
    0,
    0,
    0,
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "event_participants";

-- CreateIndex
CREATE UNIQUE INDEX "event_participant_payments_participantId_key" ON "event_participant_payments"("participantId");
