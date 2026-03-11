-- Add new profile-related columns to User table
ALTER TABLE "User"
  ADD COLUMN "firstName" TEXT,
  ADD COLUMN "lastName" TEXT,
  ADD COLUMN "ein" TEXT,
  ADD COLUMN "numberOfDependents" INTEGER,
  ADD COLUMN "occupation" TEXT,
  ADD COLUMN "streetAddress" TEXT,
  ADD COLUMN "zipCode" TEXT,
  ADD COLUMN "city" TEXT,
  ADD COLUMN "state" TEXT,
  ADD COLUMN "country" TEXT,
  ADD COLUMN "filingStatus" TEXT;

-- make legacy name column nullable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;
