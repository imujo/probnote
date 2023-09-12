import ErrorPill from "@/components/ErrorPill";
import useGetProblems from "api/problem/hooks/useGetProblems";
import { FC, MutableRefObject } from "react";
import ProblemPreview from "./ProblemPreview";
import { Skeleton } from "@/components/ui/skeleton";
import useProblemId from "hooks/useProblemId";
import { useRouter } from "next/navigation";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import useGetProblemPreview from "./useGetProblemPreview";
import { UseQueryResult } from "react-query";
import { ProblemsGet } from "@probnote/backend/src/components/problem/types.problem";
import ResponseError from "utils/ResponseError";

interface ProblemPreviewListProps {
  query: UseQueryResult<ProblemsGet, ResponseError>;
}

const ProblemPreviewList: FC<ProblemPreviewListProps> = ({ query }) => {
  const problemId = useProblemId();
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

    if (problems.length === 0) return <div>No problems found.</div>;

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
