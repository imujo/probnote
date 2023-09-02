"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

const client = new QueryClient();

function Providers({ children }: ProvidersProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
