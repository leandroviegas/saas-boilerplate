'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/dashboard/components/Sidebar';
import Navbar from '@/app/dashboard/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { authClient } from '@/lib/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkOrganization = async () => {
      if (!user) return;
      const { data } = await authClient.organization.list();
      if (!data || data.length === 0) {
        router.push('/dashboard/organization');
      }
    };
    checkOrganization();
  }, [user, router]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMinimized = () => {
    setSidebarMinimized(!sidebarMinimized);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} isMinimized={sidebarMinimized} onMinimizeToggle={toggleMinimized} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onSidebarToggle={toggleSidebar}
          showSidebarToggle={true}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}