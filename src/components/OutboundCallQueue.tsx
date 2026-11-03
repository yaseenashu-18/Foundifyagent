import React, { useState } from 'react';
import { 
  PhoneOutgoing, 
  Clock, 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Check, 
  RotateCcw,
  Building2,
  PhoneCall,
  User,
  ArrowRight
} from 'lucide-react';
import { OutboundQueueItem } from '../types/telephony';

interface OutboundCallQueueProps {
  queue: OutboundQueueItem[];
  onInitiateCallToStudent: (item: OutboundQueueItem) => void;
  onBatchDispatch: () => void;
  isCallLive: boolean;
}

export const OutboundCallQueue: React.FC<OutboundCallQueueProps> = ({
  queue,
  onInitiateCallToStudent,
  onBatchDispatch,
  isCallLive,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);

  const filteredQueue = queue.filter((item) => {
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.studentName.toLowerCase().includes(q) ||
      item.enrollmentNo.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q) ||
      item.matchedItem.toLowerCase().includes(q) ||
      item.buildingCode.toLowerCase().includes(q) ||
      item.locationFound.toLowerCase().includes(q);
    return matchesPriority && matchesSearch;
  });

  const handleStartBatch = () => {
    setIsBatchRunning(true);
    onBatchDispatch();
    setTimeout(() => {
      setIsBatchRunning(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Active Outbound Queue
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
              <PhoneOutgoing className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-[#0F172A] mt-2 tabular-nums">
            {queue.filter(q => q.status === 'Queued').length}
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">
            Pending student calls across Parul University
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Avg Match Confidence
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-mono text-2xl font-bold text-emerald-700 mt-2 tabular-nums">
            93.8%
          </div>
          <p className="text-[11px] text-[#64748B] mt-1">
            Based on campus RFID, physical specs & marks
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Voice Model Engine
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm font-bold text-[#0F172A] mt-2">
            Gemini 3.8 Live API
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 font-mono">
            24kHz Duplex · Human Voice (Zephyr)
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Campus Target Policy
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-sm font-bold text-[#0F172A] mt-2">
            Parul University
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 font-mono">
            Strict Campus Restriction Active
          </p>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student, enrollment, item, or building (A1, A27)..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg flex-shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-[#1E293B] focus:outline-none cursor-pointer"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Standard">Standard</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartBatch}
            disabled={isCallLive || isBatchRunning}
            className="h-9 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isBatchRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Dispatching Top Match...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dispatch Highest Match Call</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Queue Card Grid */}
      <div className="space-y-3">
        {filteredQueue.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center text-[#64748B] text-xs">
            No outbound campaign calls match the active filter.
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] hover:border-[#CBD5E1] transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left Column: Student Details & Contact */}
              <div className="flex items-start gap-3 min-w-[240px]">
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.matchedItem}
                    className="w-12 h-12 rounded-xl object-cover border border-[#E2E8F0] flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-sm border border-blue-200 flex-shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A]">{item.studentName}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        item.priority === 'Urgent'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : item.priority === 'High'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5 font-mono">
                    {item.enrollmentNo} · {item.department}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-xs font-bold text-[#0F172A] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {item.phone}
                    </span>
                    <span className="text-[11px] text-[#64748B]">
                      Lang: <strong className="text-[#0F172A]">{item.language.toUpperCase()}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Center Column: Matched Item & Campus Location */}
              <div className="flex-1 border-t md:border-t-0 md:border-l border-[#F1F5F9] md:pl-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8]">
                    Found Item Match
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    {item.matchConfidence}% Match
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-[#0F172A]">{item.matchedItem}</h4>
                <p className="text-xs text-[#64748B] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Found at: <strong className="text-[#1E293B]">{item.locationFound}</strong></span>
                </p>
                <p className="text-[11px] text-[#475569] italic">{item.callReason}</p>
              </div>

              {/* Right Column: Dispatch Action */}
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[#F1F5F9] md:pl-4 flex-shrink-0">
                <button
                  onClick={() => onInitiateCallToStudent(item)}
                  disabled={isCallLive}
                  className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 fill-current" />
                  <span>Dispatch AI Call Now</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
