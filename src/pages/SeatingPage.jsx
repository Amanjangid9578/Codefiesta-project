import React, { useState } from 'react';
import {
  Grid3X3,
  Sliders,
  ShieldCheck,
  Users,
  Building2,
  Printer,
  Sparkles,
  QrCode,
  User,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import { SEATING_STRATEGIES, generateSeatingLayout } from '../engine/seatingEngine';

export default function SeatingPage() {
  const { schedule, halls, students, rules } = useExamStore();

  const assignments = schedule?.assignments || [];
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(assignments[0]?.id || '');
  const [strategy, setStrategy] = useState('checkerboard');
  const [selectedSeat, setSelectedSeat] = useState(null);

  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];
  const activeHall = halls.find(h => h.id === activeAssignment?.hallId) || halls[0];

  // Re-generate layout dynamically when strategy or assignment changes
  const seatingData = activeAssignment && activeHall
    ? generateSeatingLayout(activeAssignment, activeHall, students, strategy, rules)
    : { seats: [], rows: 0, cols: 0, antiCheatingScore: 90, riskClusters: [] };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Smart Seating Engine & Visual Hall Map
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold uppercase">
              Anti-Cheating
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Algorithmic desk assignment with department alternating, cohort separation, and accessibility prioritization
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start md:self-auto flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Seating Chart</span>
        </button>
      </div>

      {/* Seating Controls Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Assignment Picker */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">Scheduled Exam & Hall</label>
          <select
            value={selectedAssignmentId}
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none"
          >
            {assignments.map(a => (
              <option key={a.id} value={a.id}>
                {a.paperCode} • {a.hallName} ({a.studentCount} students)
              </option>
            ))}
          </select>
        </div>

        {/* Strategy Picker */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-500">Seating Dispersion Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none font-medium"
          >
            {SEATING_STRATEGIES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Anti-Cheating & Accessibility Score Preview */}
        <div className="flex items-center justify-around p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Anti-Cheating Score</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {seatingData.antiCheatingScore} / 100
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned / Cap</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {seatingData.assignedCount} / {seatingData.totalCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Legend & Seat Color Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">Seat Status Legend:</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
            <span className="text-slate-700 dark:text-slate-300">Occupied (Standard)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-500 border border-blue-600" />
            <span className="text-slate-700 dark:text-slate-300">Accessibility / Ramp Seat</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
            <span className="text-slate-700 dark:text-slate-300">Empty / Buffer</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500" />
            <span className="text-slate-700 dark:text-slate-300">Late Reporting</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-500 border border-rose-600" />
            <span className="text-slate-700 dark:text-slate-300">Absent</span>
          </div>
        </div>
      </div>

      {/* Seating Grid Map (Blackboard / Podium Indicator at Top) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Teacher / Proctor Podium */}
        <div className="w-48 mx-auto py-1.5 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-center font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-widest border border-slate-300 dark:border-slate-700 shadow-inner">
          [ EXAM PODIUM / ENTRANCE ]
        </div>

        {/* Grid Matrix Table */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[650px] space-y-2">
            {(seatingData.gridMatrix || []).map((row, rIdx) => (
              <div key={rIdx} className="flex items-center space-x-2">
                {/* Row Letter */}
                <div className="w-6 text-center font-bold font-mono text-xs text-slate-400">
                  {String.fromCharCode(65 + rIdx)}
                </div>

                {/* Seats in Row */}
                <div className="flex-1 grid grid-cols-10 gap-2">
                  {row.map(seat => {
                    const isSelected = selectedSeat?.seatId === seat.seatId;

                    return (
                      <button
                        key={seat.seatId}
                        type="button"
                        onClick={() => seat.studentId && setSelectedSeat(seat)}
                        className={`p-2 rounded-xl text-center transition-all relative flex flex-col justify-between h-16 border ${
                          seat.status === 'accessibility'
                            ? 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/50 hover:border-blue-400'
                            : seat.status === 'occupied'
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-default'
                        } ${isSelected ? 'ring-2 ring-indigo-500 shadow-lg scale-105' : ''}`}
                      >
                        <div className="flex justify-between items-center w-full text-[9px] font-mono font-bold">
                          <span>{seat.seatNumber}</span>
                          {seat.isAccessibilitySeat && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          )}
                        </div>

                        {seat.studentRoll ? (
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold font-mono truncate block">
                              {seat.studentRoll}
                            </span>
                            <span className="text-[8px] font-semibold px-1 rounded bg-black/10 dark:bg-white/10 block truncate">
                              {seat.department}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Empty</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Student Seat Detail Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedSeat.studentName}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Roll: {selectedSeat.studentRoll}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Details */}
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Assigned Desk:</span>
                <strong className="font-mono text-indigo-600 dark:text-indigo-400">{selectedSeat.seatId}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Department / Batch:</span>
                <strong>{selectedSeat.department} • {selectedSeat.batchId}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Course Paper:</span>
                <strong className="font-mono">{selectedSeat.paperCode}</strong>
              </div>

              {selectedSeat.isAccessibilitySeat && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-300 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <HeartPulse className="w-4 h-4 text-blue-500" />
                    <span>Accessibility Accommodation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {selectedSeat.accessibilityDetail || 'Ramp and ground floor seating allocated.'}
                  </p>
                </div>
              )}
            </div>

            {/* Deterministic QR Code Preview */}
            <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Candidate Admit QR Payload
              </span>
              <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                <QrCode className="w-20 h-20 text-slate-900" />
                <span className="text-[8px] font-mono text-slate-500 mt-1">{selectedSeat.studentRoll}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSeat(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Close Desk Inspect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
