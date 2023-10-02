import React, { FC } from "react";
import Link from "next/link";
import { LucideSearch } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Input } from "../../../../components/ui/input";
import ButtonIcon from "@/components/ButtonIcon";
import SearchBar from "./SearchBar";
import routesConfig from "@/config/routes.config";

interface NavBarProps {}

const NavBar: FC<NavBarProps> = () => {
  return (
    <header className="z-20 flex h-16  w-screen items-center justify-between border-b-[1px] bg-white px-8">
      <Link href={routesConfig.home()} className=" font-medium">
        Probnote
      </Link>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <SearchBar />
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
