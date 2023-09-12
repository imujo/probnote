import useProblemId from "hooks/useProblemId";
import { FC } from "react";

interface ProblemPageProps {}

const ProblemPage: FC<ProblemPageProps> = ({}) => {
  const problemId = useProblemId();

  return <div>ProblemPage</div>;
};

export default ProblemPage;
