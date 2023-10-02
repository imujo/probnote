import { notFound, useParams } from "next/navigation";

export default function useRegularNoteId() {
  const params = useParams();
  const tempRegularNoteId = params.regularNoteId as string;

  if (Number.isNaN(parseInt(tempRegularNoteId, 10))) notFound();

  return parseInt(tempRegularNoteId, 10);
}
