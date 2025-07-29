/*
  Warnings:

  - You are about to drop the column `vit_number` on the `car` table. All the data in the column will be lost.
  - Added the required column `vin_number` to the `car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "car" DROP COLUMN "vit_number",
ADD COLUMN     "vin_number" TEXT NOT NULL;
