-- CreateTable
CREATE TABLE "Dream" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "emotion" VARCHAR(50),
    "clarity" SMALLINT,
    "lucid" BOOLEAN NOT NULL DEFAULT false,
    "analysis" TEXT,
    "interpretation" TEXT,
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "dreamDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symbol" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "meaning" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Symbol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "birthDate" TIMESTAMP(3),
    "birthTime" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DreamAnalytics" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalDreams" INTEGER NOT NULL DEFAULT 0,
    "avgClarity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "topEmotion" VARCHAR(50),
    "topSymbol" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DreamAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DreamToSymbol" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Symbol_name_key" ON "Symbol"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_DreamToSymbol_AB_unique" ON "_DreamToSymbol"("A", "B");

-- CreateIndex
CREATE INDEX "_DreamToSymbol_B_index" ON "_DreamToSymbol"("B");

-- CreateIndex
CREATE INDEX "Dream_createdAt_idx" ON "Dream"("createdAt");

-- CreateIndex
CREATE INDEX "Dream_dreamDate_idx" ON "Dream"("dreamDate");

-- CreateIndex
CREATE INDEX "DreamAnalytics_date_idx" ON "DreamAnalytics"("date");

-- AddForeignKey
ALTER TABLE "_DreamToSymbol"
ADD CONSTRAINT "_DreamToSymbol_A_fkey"
FOREIGN KEY ("A") REFERENCES "Dream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DreamToSymbol"
ADD CONSTRAINT "_DreamToSymbol_B_fkey"
FOREIGN KEY ("B") REFERENCES "Symbol"("id") ON DELETE CASCADE ON UPDATE CASCADE;
