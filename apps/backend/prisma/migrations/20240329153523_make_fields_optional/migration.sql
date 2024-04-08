-- AlterTable
ALTER TABLE "audit_logs" ALTER COLUMN "new_state" DROP NOT NULL,
ALTER COLUMN "old_state" DROP NOT NULL;
