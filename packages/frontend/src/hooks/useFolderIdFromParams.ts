import { useParams } from "next/navigation";
import { FolderId } from "../../types.global";

export default function useFolderIdFromParams() {
  const params = useParams();
  let tempFolderId = params.folderId[0];
  if (isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base") return;

  return tempFolderId as FolderId;
}
