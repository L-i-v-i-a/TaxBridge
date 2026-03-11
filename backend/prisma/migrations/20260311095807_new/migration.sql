-- CreateEnum
CREATE TYPE "FilingStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'NEEDS_INFO');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('CALCULATION_ONLY', 'EXPERT_GUIDED', 'FULL_FILING');

-- CreateTable
CREATE TABLE "TaxFiling" (
    "id" TEXT NOT NULL,
    "filingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL DEFAULT 'FULL_FILING',
    "taxYear" INTEGER NOT NULL DEFAULT 2024,
    "type" TEXT,
    "status" "FilingStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION,
    "personalInfo" JSONB,
    "incomeDetails" JSONB,
    "deductions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxFiling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT,
    "filingId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxFiling_filingId_key" ON "TaxFiling"("filingId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_filingId_fkey" FOREIGN KEY ("filingId") REFERENCES "TaxFiling"("id") ON DELETE CASCADE ON UPDATE CASCADE;
