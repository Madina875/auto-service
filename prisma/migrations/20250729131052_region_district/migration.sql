-- CreateTable
CREATE TABLE "region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "district" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" INTEGER NOT NULL,

    CONSTRAINT "district_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
