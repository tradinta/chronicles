'use client';

import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The DashboardShell in page.tsx handles the layout (Sidebar/Header).
  // This layout file purely serves as a container for the route segment.
  return (
    <>
      {children}
    </>
  );
}
