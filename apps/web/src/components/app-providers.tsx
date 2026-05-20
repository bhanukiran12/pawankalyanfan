"use client";

import { Providers } from "./providers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
