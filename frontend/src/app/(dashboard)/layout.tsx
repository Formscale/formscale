import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderDashboard } from "@/components/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <HeaderDashboard />
        <main className="flex flex-col items-start w-full max-w-5xl mx-auto pt-8 pb-16 p-6 gap-4 justify-start">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
