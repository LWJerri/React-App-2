/*
  Warnings:

  - You are about to drop the column `updated_at` on the `audit_logs` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Changed" ADD VALUE 'ANOTHER';

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "updated_at";
