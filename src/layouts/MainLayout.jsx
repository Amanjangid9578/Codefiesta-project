import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import GlobalSearchModal from '../components/GlobalSearchModal';
import QuickDisasterModal from '../components/QuickDisasterModal';
import ConflictModal from '../components/ConflictModal';
import { useExamStore } from '../store/examStore';
import { Flame, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [disasterOpen, setDisasterOpen] = useState(false);
  const [conflictOpen, setConflictOpen] = useState(false);

  const {
    darkMode,
    emergencyMode,
    undo,
    redo,
    validationResult,
  } = useExamStore();

  // Keyboard Shortcuts Handler
  useEffect(() => {
    let lastKey = '';
    let keyTimeout = null;

    const handleKeyDown = (e) => {
      // Ctrl + K -> Global Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        return;
      }

      // Ctrl + Z -> Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Ctrl + Y -> Redo
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
        return;
      }

      // Escape -> close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDisasterOpen(false);
        setConflictOpen(false);
        return;
      }

      // G-sequences: G then D, G then S, G then H, G then I, G then A
      const key = e.key.toLowerCase();
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (lastKey === 'g') {
          if (key === 'd') { e.preventDefault(); navigate('/dashboard'); }
          if (key === 's') { e.preventDefault(); navigate('/schedule'); }
          if (key === 'h') { e.preventDefault(); navigate('/halls'); }
          if (key === 'i') { e.preventDefault(); navigate('/invigilators'); }
          if (key === 'a') { e.preventDefault(); navigate('/analytics'); }
          lastKey = '';
          clearTimeout(keyTimeout);
          return;
        }

        if (key === 'g') {
          lastKey = 'g';
          clearTimeout(keyTimeout);
          keyTimeout = setTimeout(() => { lastKey = ''; }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, undo, redo]);

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenDisasterModal={() => setDisasterOpen(true)}
        />

        {/* Emergency Mode Banner */}
        {emergencyMode && (
          <div className="bg-red-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>
                EMERGENCY INCIDENT PROTOCOL ACTIVE — Redundant capacities primed. Non-essential operations paused.
              </span>
            </div>
            <button
              onClick={() => navigate('/recovery')}
              className="px-2.5 py-1 rounded bg-white text-red-700 font-bold hover:bg-red-50 text-[11px] transition-colors"
            >
              Open Recovery Center
            </button>
          </div>
        )}

        {/* Conflict Alert Banner if conflicts exist */}
        {!emergencyMode && validationResult?.hardViolations > 0 && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-700 dark:text-amber-300 px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>
                Schedule integrity alert: <strong>{validationResult.hardViolations} active constraint violation(s)</strong> detected.
              </span>
            </div>
            <button
              onClick={() => setConflictOpen(true)}
              className="underline font-bold text-amber-600 dark:text-amber-400 hover:opacity-80"
            >
              Inspect & Fix Conflicts
            </button>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickDisasterModal isOpen={disasterOpen} onClose={() => setDisasterOpen(false)} />
      <ConflictModal isOpen={conflictOpen} onClose={() => setConflictOpen(false)} />
    </div>
  );
}
