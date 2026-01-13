
'use client';

// This layout file can be used to wrap all dashboard pages
// However, since the dashboard page itself provides the full layout,
// this can simply pass children through.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
