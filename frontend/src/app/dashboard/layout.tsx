import { Sidebar } from "@/components/Sidebar";
import { DashboardTopNav } from "@/components/DashboardTopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <DashboardTopNav />
        <main className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
