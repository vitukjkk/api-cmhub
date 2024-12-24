/*
  Warnings:

  - You are about to drop the column `userName` on the `post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_userName_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "userName",
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_username_fkey" FOREIGN KEY ("username") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
