import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import { DocShell } from "@/components/design/DocShell";
import { brandName } from "@/lib/site";

export const metadata: Metadata = {
  title: `${brandName} Design Library`,
  description: `Every token, component, and pattern that makes ${brandName} feel like ${brandName}.`,
};

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <DocShell>{children}</DocShell>
    </ToastProvider>
  );
}
