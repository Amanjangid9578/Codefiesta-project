import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  Grid3X3,
  Clock,
  AlertOctagon,
  Users,
  BookOpen,
  Building2,
  UserCheck,
  Zap,
  Activity,
  Network,
  Sparkles,
  BarChart3,
  QrCode,
  ShieldCheck,
  History,
  Settings,
  Flame,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const NAV_GROUPS = [
  {
    group: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Operations',
    items: [
      { to: '/schedule', label: 'Master Schedule', icon: CalendarDays },
      { to: '/seating', label: 'Smart Seating', icon: Grid3X3 },
      { to: '/exam-day', label: 'Exam Day Command', icon: Clock },
      { to: '/incidents', label: 'Incident Management', icon: AlertOctagon },
    ],
  },
  {
    group: 'Intelligence',
    items: [
      { to: '/recovery', label: 'Self-Healing Playground', icon: Zap, highlight: true },
      { to: '/simulator', label: 'What-If Simulator', icon: Activity },
      { to: '/digital-twin', label: 'Schedule Digital Twin', icon: Network },
      { to: '/rules', label: 'Smart Rule Builder', icon: Sparkles },
      { to: '/analytics', label: 'Resilience Analytics', icon: BarChart3 },
    ],
  },
  {
    group: 'Resources',
    items: [
      { to: '/students', label: 'Students Roster', icon: Users },
      { to: '/exams', label: 'Examination Papers', icon: BookOpen },
      { to: '/halls', label: 'Examination Halls', icon: Building2 },
      { to: '/invigilators', label: 'Invigilator Faculty', icon: UserCheck },
    ],
  },
  {
    group: 'Portals & Verification',
    items: [
      { to: '/invigilator-portal', label: 'Invigilator Duty View', icon: ShieldCheck },
      { to: '/student-portal', label: 'Student Admit Portal', icon: GraduationCap },
      { to: '/verify', label: 'QR Seat Scanner', icon: QrCode },
    ],
  },
  {
    group: 'System',
    items: [
      { to: '/audit', label: 'Audit Trail', icon: History },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const { darkMode, emergencyMode, resilienceScore, validationResult } = useExamStore();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static flex flex-col border-r ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        emergencyMode
          ? 'bg-slate-950 border-red-900/60 text-slate-200'
          : darkMode
          ? 'bg-slate-950 border-slate-800 text-slate-200'
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">EXAMGUARD</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Self-Healing Scheduler</p>
          </div>
        </div>
      </div>

      {/* Mini Resilience Pulse Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping-slow" />
            <span>Platform Health</span>
          </span>
          <span className="font-bold text-white text-[11px] font-mono">
            {resilienceScore?.score || 94}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              (resilienceScore?.score || 94) >= 90
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : (resilienceScore?.score || 94) >= 70
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-rose-500 to-red-400'
            }`}
            style={{ width: `${resilienceScore?.score || 94}%` }}
          />
        </div>
      </div>

      {/* Navigation Links Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {group.group}
            </h3>
            <div className="space-y-0.5 pt-1">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={iIdx}
                    to={item.to}
                    onClick={() => onClose?.()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                          : item.highlight
                          ? 'text-amber-300 hover:bg-slate-800/80 hover:text-amber-200'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.highlight && (
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold">
                        Core
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Tagline */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400">
        <p className="italic text-slate-400">"Don't just schedule exams. Make them resilient."</p>
        <p className="mt-1 text-[10px] text-slate-400">Offline-first • Hackathon Edition</p>
      </div>
    </aside>
  );
}
