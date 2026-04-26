import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <main className="w-full pt-4 gap-3.5">
          <div className="pe-3.5">{children}</div>
        </main>
      </SidebarProvider>
    </ReactQueryProvider>
  );
}
