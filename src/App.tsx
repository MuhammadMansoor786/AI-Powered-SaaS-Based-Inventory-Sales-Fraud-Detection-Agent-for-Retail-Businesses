import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navigation } from './components/Navigation.tsx';
import { PublicWebsite } from './components/public/PublicWebsite.tsx';
import { StoreDashboardShell } from './components/dashboard/StoreDashboardShell.tsx';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard.tsx';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <Navigation />
      <div className="flex-1">
        {activeView === 'public' && <PublicWebsite />}
        {activeView === 'dashboard' && <StoreDashboardShell />}
        {activeView === 'superadmin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <SuperAdminDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
