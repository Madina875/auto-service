-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'OWNER', 'WORKER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(15),
    "hashedPassword" TEXT NOT NULL,
    "hashedRefreshToken" TEXT,
    "is_active" BOOLEAN DEFAULT false,
    "is_approved" BOOLEAN DEFAULT false,
    "activation_link" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
