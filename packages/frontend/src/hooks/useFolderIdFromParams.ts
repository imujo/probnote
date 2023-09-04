import { notFound, useParams } from "next/navigation";
import { FolderId } from "../utils/types.global";

export default function useFolderIdFromParams() {
  const params = useParams();
  const tempFolderId = params.folderId[0];

  if (Number.isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base")
    notFound();

  return tempFolderId as FolderId;
}
