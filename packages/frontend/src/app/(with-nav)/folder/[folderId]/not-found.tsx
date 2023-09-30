import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";

interface NotFoundProps {}

const NotFound: FC<NotFoundProps> = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <h1 className=" text-4xl font-medium text-zinc-800">Not Found</h1>
      <p className=" mb-4 text-lg font-light text-zinc-500">
        The folder you were looking for does not exist
      </p>
      <Link href="/folder/base">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
