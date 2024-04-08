/*
  Warnings:

  - Added the required column `related_model` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_state` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_state` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Model" AS ENUM ('LIST', 'TASK');

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "related_model" "Model" NOT NULL,
DROP COLUMN "new_state",
ADD COLUMN     "new_state" JSONB NOT NULL,
DROP COLUMN "old_state",
ADD COLUMN     "old_state" JSONB NOT NULL;
