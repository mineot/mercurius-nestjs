-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "langId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "photo_sm" TEXT NOT NULL,
    "photo_lg" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    CONSTRAINT "profiles_langId_fkey" FOREIGN KEY ("langId") REFERENCES "languages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
