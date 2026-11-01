import React, { useState } from 'react';
import { ResearchProvider, useResearch } from './context/ResearchContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { NotificationToast } from './components/NotificationToast';
import { TargetDetailsModal } from './pages/TargetDetailsModal';
import { TargetComparisonModal } from './components/TargetComparisonModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { TargetDiscoveryPage } from './pages/TargetDiscoveryPage';
import { TargetRankingPage } from './pages/TargetRankingPage';
import { PathwayExplorerPage } from './pages/PathwayExplorerPage';
import { WorkspaceReportsPage } from './pages/WorkspaceReportsPage';
import { BioResourcesPage } from './pages/BioResourcesPage';

function AppContent() {
  const { currentPage, user } = useResearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If user is on public landing page or login page:
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <LandingPage />
        <NotificationToast />
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <AuthPage />
        <NotificationToast />
      </div>
    );
  }

  // Authenticated workspace shell with Sidebar + Navbar
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased">
      
      {/* Desktop Persistent Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen border-r border-slate-800 bg-slate-900 z-40 overflow-hidden">
        <Sidebar />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-50 flex h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area - Expands to available viewport width and scrolls naturally */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full">
        <Navbar
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="flex-1 w-full pb-16">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'library' && <LibraryPage />}
          {currentPage === 'discovery' && <TargetDiscoveryPage />}
          {currentPage === 'ranking' && <TargetRankingPage />}
          {currentPage === 'pathway' && <PathwayExplorerPage />}
          {currentPage === 'workspace' && <WorkspaceReportsPage />}
          {currentPage === 'resources' && <BioResourcesPage />}
        </main>
      </div>

      {/* Page 7: Target Details Modal (Can be invoked from anywhere) */}
      <TargetDetailsModal />

      {/* Multi-Target Head-to-Head Comparison Modal */}
      <TargetComparisonModal />

      {/* Global Notification Toast */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <ResearchProvider>
      <AppContent />
    </ResearchProvider>
  );
}
