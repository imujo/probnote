import { useCallback, useEffect, useMemo, useRef } from "react";
import useGetProblems from "api/problem/hooks/useGetProblems";
import useExerciseNoteId from "hooks/useExerciseNoteId";
import useOptionalProblemId from "hooks/useOptionalProblemId";
import { useRouter } from "next/navigation";
import routesConfig from "@/config/routes.config";

export default function useGetProblemPreview() {
  const problemId = useOptionalProblemId();
  const exerciseNoteId = useExerciseNoteId();
  const router = useRouter();

  const query = useGetProblems({
    onSuccess: (data) => {
      if (!problemId && data && data?.data.problems.length !== 0) {
        router.replace(
          `/note/exercise/${exerciseNoteId}/problem/${data.data.problems[0].id}`,
        );
      }
    },
  });
  const problemListRef = useRef<null | HTMLDivElement>(null);

  const data = useMemo(() => query.data, [query]);

  const currentProblemIndex = useMemo(() => {
    const index = data?.data.problems.findIndex(
      (problem) => problem.id === problemId,
    );
    if (index === -1 || index === undefined) return null;

    return index;
  }, [data, problemId]);

  const scrollIntoView = useCallback(
    (offset: number) => {
      if (problemListRef.current && currentProblemIndex !== null) {
        const selectedElement =
          problemListRef.current.children[0].children[currentProblemIndex];

        if (selectedElement) {
          const parent = selectedElement.parentElement;
          const elementRect = selectedElement.getBoundingClientRect();
          const parentRect = parent?.getBoundingClientRect();

          const yPositionRelativeToParent =
            elementRect.top - (parentRect?.top || 0);

          problemListRef.current.scrollTo({
            behavior: "smooth",
            top: yPositionRelativeToParent + offset,
          });
        }
      }
    },
    [problemListRef, currentProblemIndex],
  );

  const prevDisabled = useMemo(
    () => currentProblemIndex === null || currentProblemIndex === 0,
    [currentProblemIndex],
  );
  const nextDisabled = useMemo(
    () =>
      currentProblemIndex === null ||
      currentProblemIndex + 1 === data?.data.problems.length,
    [currentProblemIndex, data],
  );

  const onClickNext = useCallback(() => {
    if (currentProblemIndex === null || !data) return;
    const problems = data.data.problems;

    if (nextDisabled) return;

    router.push(
      routesConfig.problem(
        exerciseNoteId,
        problems[currentProblemIndex + 1].id,
      ),
    );

    scrollIntoView(50);
  }, [data, problemId, router]);

  const onClickPrev = useCallback(() => {
    if (currentProblemIndex === null || !data) return;
    const problems = data.data.problems;

    if (prevDisabled) return;

    router.push(
      routesConfig.problem(
        exerciseNoteId,
        problems[currentProblemIndex - 1].id,
      ),
    );

    scrollIntoView(-200);
  }, [data, problemId, router]);

  useEffect(() => {
    scrollIntoView(100);
  }, [problemListRef]);

  return {
    query,
    onClickNext,
    onClickPrev,
    nextDisabled,
    prevDisabled,
    problemListRef,
  };
}
