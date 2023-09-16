import ErrorPill from "@/components/ErrorPill";
import { FC } from "react";
import ProblemPreview from "./ProblemPreview";
import { Skeleton } from "@/components/ui/skeleton";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import { UseQueryResult } from "react-query";
import { ProblemsGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";
import useOptionalProblemId from "hooks/useOptionalProblemId";

interface ProblemPreviewListProps {
  query: UseQueryResult<ProblemsGet, ResponseError>;
}

const ProblemPreviewList: FC<ProblemPreviewListProps> = ({ query }) => {
  const problemId = useOptionalProblemId();
  const exerciseNoteId = useExerciseNoteId();
  const { isLoading, error, data, isError, isSuccess } = query;

  if (isLoading)
    return (
      <>
        <Skeleton className=" mb-4 aspect-[500_/_200] w-full rounded-lg" />
        <Skeleton className=" mb-4 aspect-[500_/_200] w-full rounded-lg" />
        <Skeleton className=" mb-4 aspect-[500_/_200] w-full rounded-lg" />
        <Skeleton className=" mb-4 aspect-[500_/_200] w-full rounded-lg" />
        <Skeleton className=" mb-4 aspect-[500_/_200] w-full rounded-lg" />
      </>
    );
  else if (isError) return <ErrorPill>{error.message}</ErrorPill>;
  else if (isSuccess) {
    const problems = data.data.problems;

    if (problems.length === 0) return;

    return problems.map((problem) => {
      let state: "default" | "edited" | "selected" = "default";
      if (problemId === problem.id) {
        state = "selected";
      } else if (problem.edited) state = "edited";
      return (
        <ProblemPreview
          state={state}
          key={problem.id}
          {...problem}
          exerciseNoteId={exerciseNoteId}
          className="mb-4"
        />
      );
    });
  }
};

export default ProblemPreviewList;
