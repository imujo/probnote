import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import { FC, useEffect, useState } from "react";
import { UseQueryResult } from "react-query";
import ResponseError from "utils/ResponseError";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorPill from "@/components/ErrorPill";

interface ProblemImageProps {
  query: UseQueryResult<ProblemGet, ResponseError>;
}

const ProblemImage: FC<ProblemImageProps> = ({ query }) => {
  const { data, isLoading, isError, isSuccess, error } = query;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (isLoading) return <Skeleton className="mx-auto aspect-video h-full " />;
  else if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorPill>{error.message}</ErrorPill>
      </div>
    );
  else if (!isSuccess)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorPill>Something went wrong</ErrorPill>
      </div>
    );

  return (
    <>
      {!isImageLoaded && <Skeleton className="mx-auto aspect-video h-full " />}
      <Image
        priority
        src={data.data.url}
        alt="problem"
        fill
        className="object-contain"
        onLoadingComplete={() => setIsImageLoaded(true)}
      />
    </>
  );
};

export default ProblemImage;
