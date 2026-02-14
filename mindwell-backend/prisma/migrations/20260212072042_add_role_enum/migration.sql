/*
  Warnings:

  - You are about to drop the column `isPremium` on the `User` table. All the data in the column will be lost.
  - Added the required column `authTag` to the `Journal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iv` to the `Journal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PREMIUM', 'ADMIN');

-- AlterTable
ALTER TABLE "Journal" ADD COLUMN     "authTag" TEXT NOT NULL,
ADD COLUMN     "iv" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPremium",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
