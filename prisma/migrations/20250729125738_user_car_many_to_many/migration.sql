-- CreateTable
CREATE TABLE "car_history" (
    "id" SERIAL NOT NULL,
    "carId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "buyed_at" TIMESTAMP(3) NOT NULL,
    "sold_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "car_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_history_userId_carId_key" ON "car_history"("userId", "carId");

-- AddForeignKey
ALTER TABLE "car_history" ADD CONSTRAINT "car_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_history" ADD CONSTRAINT "car_history_carId_fkey" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
