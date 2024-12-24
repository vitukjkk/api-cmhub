-- AlterTable
ALTER TABLE "post" ADD COLUMN     "userName" TEXT NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "name" SET DEFAULT 'Usuário sem nome cadastrado.',
ALTER COLUMN "username" SET DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_userName_fkey" FOREIGN KEY ("userName") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
