/*
  Warnings:

  - Made the column `manufacturer` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `img` on table `Medicine` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Medicine" ALTER COLUMN "manufacturer" SET NOT NULL,
ALTER COLUMN "img" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "image" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Medicine_name_idx" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "Medicine_price_idx" ON "Medicine"("price");

-- CreateIndex
CREATE INDEX "Medicine_categoryId_idx" ON "Medicine"("categoryId");

-- CreateIndex
CREATE INDEX "Medicine_manufacturer_idx" ON "Medicine"("manufacturer");
