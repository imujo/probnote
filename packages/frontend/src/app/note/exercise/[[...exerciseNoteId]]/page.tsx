"use client";

import { ChangeEvent, FC } from "react";
import AddProblemsButton from "./components/addProblems/AddProblemsModal";

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
