-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratedImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "assetId" TEXT,
    "prompt" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "variables" JSONB NOT NULL,
    "provider" TEXT NOT NULL,
    "providerModel" TEXT,
    "providerMetadata" JSONB,
    "providerError" TEXT,
    "seed" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "GeneratedImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GeneratedImage_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GeneratedImage_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GeneratedImage" ("assetId", "createdAt", "deletedAt", "height", "id", "isFavorite", "jobId", "negativePrompt", "prompt", "provider", "providerError", "providerMetadata", "providerModel", "seed", "userId", "variables", "width") SELECT "assetId", "createdAt", "deletedAt", "height", "id", "isFavorite", "jobId", "negativePrompt", "prompt", "provider", "providerError", "providerMetadata", "providerModel", "seed", "userId", "variables", "width" FROM "GeneratedImage";
DROP TABLE "GeneratedImage";
ALTER TABLE "new_GeneratedImage" RENAME TO "GeneratedImage";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
