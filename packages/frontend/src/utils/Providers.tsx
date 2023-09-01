"use client";
import { Toaster } from "@/components/ui/toaster";
import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

interface ProvidersProps {
  children: ReactNode;
}

const client = new QueryClient();

function Providers({ children }: ProvidersProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
