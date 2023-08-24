import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface BreadcrumbSkeletonProps {}

const BreadcrumbSkeleton: FC<BreadcrumbSkeletonProps> = ({}) => {
  return <Skeleton className="h-[14px] w-[200px] rounded-full" />;
};

export default BreadcrumbSkeleton;
