-- CreateTable
CREATE TABLE "car" (
    "id" SERIAL NOT NULL,
    "plate_number" TEXT NOT NULL,
    "vit_number" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "car_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "car" ADD CONSTRAINT "car_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
