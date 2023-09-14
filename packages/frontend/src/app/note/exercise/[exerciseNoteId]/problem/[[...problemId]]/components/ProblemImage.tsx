import { ProblemGet } from "@probnote/backend/src/components/problem/types.problem";
import { FC, useState } from "react";
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

  if (isLoading) return <Skeleton className="aspect-video h-full " />;
  else if (isError) return <ErrorPill>{error.message}</ErrorPill>;
  else if (!isSuccess) return <ErrorPill>Something went wrong</ErrorPill>;

  return (
    <>
      <Image
        priority
        src={data.data.url}
        alt="problem"
        fill
        className="object-contain"
        onLoadingComplete={() => setIsImageLoaded(true)}
      />
      {!isImageLoaded && <Skeleton className="aspect-video h-full " />}
    </>
  );
};

export default ProblemImage;
