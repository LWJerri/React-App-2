/*
  Warnings:

  - You are about to drop the column `changed` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `previous_state` on the `audit_logs` table. All the data in the column will be lost.
  - Added the required column `affected_field` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "changed",
DROP COLUMN "previous_state",
ADD COLUMN     "affected_field" TEXT NOT NULL,
ADD COLUMN     "old_state" TEXT;

-- DropEnum
DROP TYPE "Changed";
