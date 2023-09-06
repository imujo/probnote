"use client";

import useExerciseNoteId from "hooks/useExerciseNoteId";
import { ChangeEvent, FC } from "react";
import { Button } from "@/components/ui/button";
import useGetUploadUrls from "api/problem/hooks/usePostProblems";
import { Progress } from "@/components/ui/progress";
import useUploadProblems from "../../../../api/problem/hooks/useUploadProblemImages";
import AddProblemsButton from "./components/addProblems/AddProblemsButton";

interface ExerciseNotePageProps {}

const ExerciseNotePage: FC<ExerciseNotePageProps> = () => {
  return (
    <div>
      {/* <input type="file" multiple onChange={onInputChange} />
      <button onClick={onUploadFile}>Upload File</button>
      <Button onClick={onUploadFile}>Upl</Button>
      {files.map((file) => {
        return (
          <div>
            <h5>{file.name}</h5>
            {fileUploadProgress && fileUploadProgress[file.name] ? (
              <Progress value={fileUploadProgress[file.name]} />
            ) : null}
          </div>
        );
      })}
      {isLoading && <div>loading</div>}
      {isSuccess && <div>success</div>}
      {JSON.stringify(data)} */}
      <AddProblemsButton />
    </div>
  );
};

export default ExerciseNotePage;
