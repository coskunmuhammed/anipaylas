import React from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import './admin.css';
import AdminNavigation from './AdminNavigation';

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <AdminNavigation session={session}>
      {children}
    </AdminNavigation>
  );
}
