"use client";

import routesConfig from "@/config/routes.config";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.replace(routesConfig.folder());
}
