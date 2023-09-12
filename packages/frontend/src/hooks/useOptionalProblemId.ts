import { notFound, useParams } from "next/navigation";

export default function useOptionalProblemId() {
  const params = useParams();

  if (!params.problemId) return null;

  const tempProblemId = params.problemId[0];

  if (Number.isNaN(parseInt(tempProblemId, 10))) notFound();

  return parseInt(tempProblemId, 10);
}
