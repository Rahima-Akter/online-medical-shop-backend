/*
  Warnings:

  - Added the required column `date_of_birth` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `default_shipping_address` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('CUSTOMER', 'SELLER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "blood_type" TEXT,
ADD COLUMN     "date_of_birth" TEXT NOT NULL,
ADD COLUMN     "default_shipping_address" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'CUSTOMER';
