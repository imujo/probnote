import { notFound, useParams } from "next/navigation";

export default function useExerciseNoteId() {
  const params = useParams();
  const tempExerciseNoteId = params.exerciseNoteId[0];

  if (Number.isNaN(parseInt(tempExerciseNoteId, 10))) notFound();

  return parseInt(tempExerciseNoteId, 10);
}
