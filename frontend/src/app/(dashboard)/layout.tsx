import { AppSidebar } from "@/components/app-sidebar";
import { HeaderDashboard } from "@/components/header";
import SuspenseWrapper from "@/components/suspense-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FormsProvider, LogsProvider } from "@/providers";

// export const runtime = "edge";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <FormsProvider>
      <LogsProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <HeaderDashboard />
            <main className="flex flex-col z-10 relative items-start w-full max-w-5xl mx-auto pt-8 pb-16 p-6 gap-4 justify-start">
              <SuspenseWrapper>{children}</SuspenseWrapper>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </LogsProvider>
    </FormsProvider>
  );
}
