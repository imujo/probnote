import { FC } from "react";
import BreadcrumbItem from "./BreadcrumbItem";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  className?: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ className }) => {
  return (
    <ul className={cn("flex text-xs font-light", className)}>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Semestar 2</BreadcrumbItem>
      <BreadcrumbItem>Matan 2</BreadcrumbItem>
      <BreadcrumbItem>6.1. Kombinatorika</BreadcrumbItem>
      <BreadcrumbItem last>Skripta</BreadcrumbItem>
    </ul>
  );
};

export default Breadcrumbs;
