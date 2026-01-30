/*
  Warnings:

  - Made the column `default_shipping_address` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date_of_birth` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "default_shipping_address" SET NOT NULL,
ALTER COLUMN "date_of_birth" SET NOT NULL;
