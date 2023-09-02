import { useParams } from "next/navigation";
import { FolderId } from "../utils/types.global";

export default function useFolderIdFromParams() {
  const params = useParams();
  const tempFolderId = params.folderId[0];

  if (Number.isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base")
    throw new Error("Folder id is not number or base");

  return tempFolderId as FolderId;
}
