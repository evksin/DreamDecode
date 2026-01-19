-- Перенос приватности на публичность и добавление избранного
ALTER TABLE "Prompt" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Prompt" SET "isPublic" = NOT "isPrivate";
ALTER TABLE "Prompt" DROP COLUMN "isPrivate";

ALTER TABLE "Prompt" ADD COLUMN "isFavorite" BOOLEAN NOT NULL DEFAULT false;
