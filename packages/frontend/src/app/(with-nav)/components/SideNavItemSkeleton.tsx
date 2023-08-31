import { FC } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SideNavItemSkeletonProps {}

const SideNavItemSkeleton: FC<SideNavItemSkeletonProps> = ({}) => {
  return (
    <li className="flex">
      <Skeleton className="m-1 flex-1 rounded-md py-3 "></Skeleton>
    </li>
  );
};

export default SideNavItemSkeleton;
