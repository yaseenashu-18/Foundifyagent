import React from 'react';
import { 
  PhoneCall, 
  ListOrdered, 
  FileText, 
  Database, 
  ShieldCheck, 
  Sliders, 
  Hash, 
  Radio, 
  Building2,
  Sparkles,
  PhoneOutgoing,
  BarChart3,
  ExternalLink
} from 'lucide-react';

export type PlatformTab = 
  | 'telephony' 
  | 'matches'
  | 'insights'
  | 'queue' 
  | 'records' 
  | 'registry' 
  | 'security' 
  | 'persona' 
  | 'dids';

interface PlatformSidebarProps {
  activeTab: PlatformTab;
  onSelectTab: (tab: PlatformTab) => void;
  queueCount: number;
  isCallLive: boolean;
}

export const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
  activeTab,
  onSelectTab,
  queueCount,
  isCallLive,
}) => {
  const mainNav = [
    {
      id: 'telephony' as PlatformTab,
      label: 'Live Calling Console',
      icon: PhoneCall,
      badge: isCallLive ? 'LIVE' : undefined,
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200 animate-pulse font-bold',
    },
    {
      id: 'matches' as PlatformTab,
      label: 'Outbound AI Matches',
      icon: Sparkles,
      badge: '6 Matched',
      badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold',
    },
    {
      id: 'insights' as PlatformTab,
      label: 'AI Insights & Dashboard',
      icon: BarChart3,
      badge: '95.4%',
      badgeColor: 'bg-purple-50 text-purple-700 border border-purple-200 font-bold',
    },
    {
      id: 'queue' as PlatformTab,
      label: 'Outbound Call Queue',
      icon: ListOrdered,
      badge: queueCount > 0 ? `${queueCount} Pending` : undefined,
      badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200 font-bold',
    },
    {
      id: 'records' as PlatformTab,
      label: 'Call Audit Ledger',
      icon: FileText,
      badge: '5 Logged',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const campusNav = [
    {
      id: 'registry' as PlatformTab,
      label: 'Parul Campus Registry',
      icon: Database,
      desc: 'Lost & Found database',
    },
    {
      id: 'security' as PlatformTab,
      label: 'C5 Security Vault',
      icon: ShieldCheck,
      desc: 'Custody Room 102',
    },
  ];

  const systemNav = [
    {
      id: 'persona' as PlatformTab,
      label: 'Voice Persona & Rules',
      icon: Sliders,
      desc: 'Voices & guardrails',
    },
    {
      id: 'dids' as PlatformTab,
      label: 'DID Numbers & Helplines',
      icon: Hash,
      desc: 'Campus trunks',
    },
  ];

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen select-none z-20">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#0F172A]">Foundify</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 text-[#2563EB] font-bold border border-blue-200">
                VOICE AI
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-none">Parul University Hub</p>
          </div>
        </div>
      </div>

      {/* Main Operations Navigation */}
      <div className="p-3 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
          Agent Calling Station
        </div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] shadow-2xs'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Campus Knowledge & Custody */}
      <div className="p-3 border-t border-[#F1F5F9] space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-1 flex items-center justify-between">
          <span>Campus Custody</span>
          <span className="text-[9px] font-mono text-[#2563EB] font-bold">PORTAL</span>
        </div>

        {/* Redirect link to official foundify app */}
        <a
          href="https://foundify-9osq.onrender.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 transition-all cursor-pointer shadow-2xs group mb-1.5"
          title="Open official Foundify Web App (foundify-9osq.onrender.com)"
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div className="text-left">
              <div className="leading-tight font-bold">Official Foundify</div>
              <div className="text-[10px] text-blue-500 font-mono">foundify-9osq.onrender.com</div>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </a>

        {campusNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] shadow-2xs'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Agent Voice Configuration */}
      <div className="p-3 border-t border-[#F1F5F9] space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
          Agent Settings
        </div>
        {systemNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] shadow-2xs'
                  : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#64748B]'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}

        {/* Campus Restriction Note */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px] mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Restriction</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight">
            Only Parul University locations (A1–A29, C1–C5, H1–H36, F1–F3, G1–G2, P1–P8) supported.
          </p>
        </div>
      </div>

      {/* SIP Trunk Telemetry Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-[11px] font-bold text-[#0F172A]">PU SIP TRUNK</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
            99.98%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-[#64748B]">
          <div>
            <span className="text-[#94A3B8]">Jitter:</span> 1.1ms
          </div>
          <div>
            <span className="text-[#94A3B8]">Loss:</span> 0.01%
          </div>
        </div>
      </div>
    </aside>
  );
};
