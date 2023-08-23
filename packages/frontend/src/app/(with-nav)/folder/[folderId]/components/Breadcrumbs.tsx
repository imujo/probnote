import { FC } from "react";
import BreadcrumbItem from "./BreadcrumbItem";

interface BreadcrumbsProps {}

const Breadcrumbs: FC<BreadcrumbsProps> = ({}) => {
  return (
    <ul className="flex text-xs font-light">
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Semestar 2</BreadcrumbItem>
      <BreadcrumbItem>Matan 2</BreadcrumbItem>
      <BreadcrumbItem>6.1. Kombinatorika</BreadcrumbItem>
      <BreadcrumbItem last>Skripta</BreadcrumbItem>
    </ul>
  );
};

export default Breadcrumbs;
