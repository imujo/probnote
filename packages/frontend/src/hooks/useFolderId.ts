import { notFound, useParams } from "next/navigation";
import { FolderId } from "../utils/types.global";

export default function useFolderId() {
  const params = useParams();
  const tempFolderId = params.folderId as string;

  if (Number.isNaN(parseInt(tempFolderId, 10)) && tempFolderId !== "base")
    notFound();

  return tempFolderId as FolderId;
}
