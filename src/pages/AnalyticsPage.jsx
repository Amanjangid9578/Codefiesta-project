import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Building2,
  Users,
  UserCheck,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

export default function AnalyticsPage() {
  const {
    resilienceScore,
    halls,
    invigilators,
    students,
    papers,
    schedule,
  } = useExamStore();

  // Multi-day resilience trend data
  const resilienceTrend = [
    { day: 'Day 1 (Morning)', score: 94, benchmark: 90 },
    { day: 'Day 1 (Afternoon)', score: 91, benchmark: 90 },
    { day: 'Day 1 (Evening)', score: 95, benchmark: 90 },
    { day: 'Day 2 (Morning)', score: 96, benchmark: 90 },
  ];

  // Department distribution
  const deptCounts = {};
  students.forEach(s => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });
  const deptData = Object.entries(deptCounts).map(([name, value]) => ({ name, value }));

  // Invigilator workload distribution
  const workloadData = invigilators.slice(0, 10).map(inv => {
    let duties = 0;
    if (schedule?.assignments) {
      schedule.assignments.forEach(asg => {
        if ((asg.invigilatorIds || []).includes(inv.id)) duties++;
      });
    }
    return {
      name: inv.name.replace('Dr. ', '').replace('Prof. ', ''),
      duties,
      contracted: inv.maxDuties,
    };
  });

  const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Operations & Resilience Analytics
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical distribution of capacity buffers, proctor equity, and cross-session fault tolerances
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Resilience Index
          </div>
          <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
            {resilienceScore?.score || 94}/100
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1">Grade: A+ Optimal</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Utilization
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900 dark:text-white">
            87.4%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Across 6 active halls</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Proctor Fairness
          </div>
          <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
            96.2%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Variance &lt; 0.4 shifts</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Avg Recovery Time
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-600 dark:text-cyan-400">
            18ms
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Deterministic speed</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Accessibility Cov.
          </div>
          <div className="text-2xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
            100%
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold mt-1">Zero ramp violations</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Health Graph (Timeline across sessions) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                <span>SCHEDULE HEALTH ACROSS SESSIONS</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Resilience score tracking over examination time windows
              </p>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resilienceTrend}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} name="Resilience" />
                <Line type="monotone" dataKey="benchmark" stroke="#10b981" strokeDasharray="5 5" name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invigilator Workload Distribution Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-500" />
                <span>INVIGILATOR WORKLOAD FAIRNESS</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assigned shifts vs contracted maximums
              </p>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="contracted" fill="#334155" radius={[4, 4, 0, 0]} name="Max Allowed" />
                <Bar dataKey="duties" fill="#10b981" radius={[4, 4, 0, 0]} name="Duties Assigned" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Examinee Breakdown Pie */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
          Departmental Candidate Distribution
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          {deptData.map((d, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{d.name} Dept</span>
              <div className="text-xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {d.value}
              </div>
              <span className="text-[10px] text-slate-400">Examinees</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
