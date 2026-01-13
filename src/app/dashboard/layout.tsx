
'use client';

import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(false); // Simplified for layout

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? 'bg-[#121212]' : 'bg-background'}`}>
      {children}
    </div>
  );
}
