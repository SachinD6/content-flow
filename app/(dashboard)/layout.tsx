import { LogoutButton } from '@/features/auth';

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar will go here */}
      <aside className="hidden w-64 border-r bg-muted/40 md:block">
        <nav className="p-4 flex flex-col h-full justify-between">
          <div className="text-sm text-muted-foreground">
            Dashboard navigation coming soon.
          </div>
          <LogoutButton />
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
