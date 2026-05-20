"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#171717",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fafafa",
          },
        }}
      />
    </>
  );
}
