/*
  Warnings:

  - Made the column `content` on table `post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "post" ADD COLUMN     "image" TEXT,
ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "bio" SET DEFAULT 'Usuário sem bio cadastrada.';
