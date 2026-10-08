import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { AppGate } from "@/components/layout/AppGate";
import { AdvisorWidget } from "@/components/advisor/AdvisorWidget";
import { ToastProvider } from "@/components/ui/Toast";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AppGate>
        <div className="flex min-h-dvh bg-[var(--color-canvas)]">
          <Sidebar />
          <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
            <Topbar />
            <main id="main-content" className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-14 lg:pt-9">
              <div className="mx-auto w-full max-w-[1180px]">{children}</div>
            </main>
          </div>
        </div>
        <MobileNav />
        <AdvisorWidget />
      </AppGate>
    </ToastProvider>
  );
}
