-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "twoFactorSecret" TEXT
);

-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "allow_register" BOOLEAN NOT NULL DEFAULT false,
    "allow_two_factor" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issuer" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoke_at" DATETIME,
    "revoke_days" INTEGER
);

-- CreateTable
CREATE TABLE "languages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "country" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "terms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "langId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "terms_langId_fkey" FOREIGN KEY ("langId") REFERENCES "languages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_issuer_key" ON "tokens"("issuer");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");
