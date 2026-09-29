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
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10 lg:pt-8">
              <div className="mx-auto w-full max-w-6xl">{children}</div>
            </main>
          </div>
        </div>
        <MobileNav />
        <AdvisorWidget />
      </AppGate>
    </ToastProvider>
  );
}
