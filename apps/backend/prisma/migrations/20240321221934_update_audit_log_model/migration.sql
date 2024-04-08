/*
  Warnings:

  - Added the required column `changed` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Changed" AS ENUM ('NAME', 'DESCRIPTION', 'DUE_AT', 'PRIORITY', 'LIST_ID');

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "changed" "Changed" NOT NULL;
