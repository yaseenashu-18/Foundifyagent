import React from 'react';
import { Mic, Plus, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface CampusHeaderProps {
  onOpenNewReport: () => void;
  onActivateVoice: () => void;
}

export const CampusHeader: React.FC<CampusHeaderProps> = ({
  onOpenNewReport,
  onActivateVoice,
}) => {
  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between select-none z-10 sticky top-0">
      {/* Left Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#2563EB]" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A]">Parul University</span>
              <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                Vadodara, Gujarat
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] hidden sm:block">
              Campus-Exclusive Lost &amp; Found Voice Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onActivateVoice}
          className="h-9 px-3.5 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-[#BFDBFE]"
        >
          <Mic className="w-4 h-4 text-[#2563EB]" />
          <span className="hidden sm:inline">Talk to Voice AI</span>
        </button>

        <button
          onClick={onOpenNewReport}
          className="h-9 px-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>New Campus Report</span>
        </button>
      </div>
    </header>
  );
};
