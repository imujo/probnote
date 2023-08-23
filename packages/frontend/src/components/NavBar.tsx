import Link from "next/link";
import { FC } from "react";
import { Input } from "./ui/input";
import { ButtonIcon } from "./ButtonIcon";
import { LucideSearch } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  return (
    <header className="fixed left-0 top-0 flex h-16  w-screen items-center justify-between border-b-[1px] bg-white px-8">
      <Link href="/" className=" font-medium">
        Probnote
      </Link>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search folders and notes" />
        <ButtonIcon Icon={LucideSearch} />
      </div>
      <ul>
        <li>
          <UserButton />
        </li>
      </ul>
    </header>
  );
};

export default NavBar;
