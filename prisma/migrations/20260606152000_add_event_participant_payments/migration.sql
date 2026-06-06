-- AlterTable
ALTER TABLE "event_participants" ADD COLUMN "payments" JSONB NOT NULL DEFAULT '{"tournament":0,"bar":0,"games":0,"paid":0}';
