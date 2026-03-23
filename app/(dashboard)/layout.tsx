export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar will go here */}
      <aside className="hidden w-64 border-r bg-muted/40 md:block">
        <nav className="p-4 text-sm text-muted-foreground">
          Dashboard navigation coming soon.
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
