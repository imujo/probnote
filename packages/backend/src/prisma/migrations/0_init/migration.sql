-- CreateTable
CREATE TABLE "FolderItem" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "label" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentFolderId" INTEGER,

    CONSTRAINT "FolderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "datePinned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folderItemId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "folderItemId" INTEGER NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseNote" (
    "id" SERIAL NOT NULL,
    "noteId" INTEGER NOT NULL,

    CONSTRAINT "ExerciseNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegularNote" (
    "id" SERIAL NOT NULL,
    "noteId" INTEGER NOT NULL,
    "canvas" JSONB,

    CONSTRAINT "RegularNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "exerciseNoteId" INTEGER NOT NULL,
    "canvas" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "problemFileKey" TEXT NOT NULL,
    "solutionFileKey" TEXT,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FolderItem_label_userId_idx" ON "FolderItem"("label", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_folderItemId_key" ON "Folder"("folderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_folderItemId_key" ON "Note"("folderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseNote_noteId_key" ON "ExerciseNote"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "RegularNote_noteId_key" ON "RegularNote"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problemFileKey_key" ON "Problem"("problemFileKey");

-- AddForeignKey
ALTER TABLE "FolderItem" ADD CONSTRAINT "FolderItem_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_folderItemId_fkey" FOREIGN KEY ("folderItemId") REFERENCES "FolderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_folderItemId_fkey" FOREIGN KEY ("folderItemId") REFERENCES "FolderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseNote" ADD CONSTRAINT "ExerciseNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegularNote" ADD CONSTRAINT "RegularNote_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_exerciseNoteId_fkey" FOREIGN KEY ("exerciseNoteId") REFERENCES "ExerciseNote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

