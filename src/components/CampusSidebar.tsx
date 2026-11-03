import React from 'react';
import { 
  Mic, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Building2, 
  PhoneCall, 
  Radio, 
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import { CURRENT_CAMPUS_USER } from '../data/parulCampusData';

export type CampusTab = 'assistant' | 'telephony' | 'registry' | 'map' | 'security';

interface CampusSidebarProps {
  activeTab: CampusTab;
  onSelectTab: (tab: CampusTab) => void;
  onQuickVoiceTrigger: () => void;
}

export const CampusSidebar: React.FC<CampusSidebarProps> = ({
  activeTab,
  onSelectTab,
  onQuickVoiceTrigger,
}) => {
  const navItems = [
    {
      id: 'assistant' as CampusTab,
      label: 'Campus Voice Assistant',
      icon: Mic,
      badge: 'Gemini 3.8',
      badgeColor: 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]',
    },
    {
      id: 'telephony' as CampusTab,
      label: 'Inbound / Outbound Calls',
      icon: PhoneCall,
      badge: 'Live SIP',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'registry' as CampusTab,
      label: 'Lost & Found Registry',
      icon: Search,
      badge: 'Live',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'map' as CampusTab,
      label: 'Campus Buildings (A1-A29)',
      icon: Building2,
      badge: '29 Blocks',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'security' as CampusTab,
      label: 'Security Vault & Cabin',
      icon: ShieldCheck,
      badge: 'Gate 1 / C5',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <aside className="w-[250px] flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen select-none z-20">
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm font-bold text-sm">
            PU
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-[#0F172A]">Foundify AI</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                CAMPUS
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium leading-none">
              Parul University, Vadodara
            </p>
          </div>
        </div>
      </div>

      {/* Authenticated User Session Card */}
      <div className="p-3 border-b border-[#F1F5F9]">
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <img
              src={CURRENT_CAMPUS_USER.avatarUrl}
              alt={CURRENT_CAMPUS_USER.name}
              className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
            />
            <div className="flex-1 truncate">
              <span className="text-xs font-bold text-[#0F172A] block truncate">
                {CURRENT_CAMPUS_USER.name}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] block truncate">
                {CURRENT_CAMPUS_USER.enrollmentNo}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B]">
            <span>CSE Department</span>
            <span className="text-[#2563EB] font-semibold">H4 Tagore</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-1">
          Campus Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#EFF6FF] text-[#1D4ED8] font-bold shadow-2xs'
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

        {/* Parul University Rule Callout */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
            <Info className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Strict Campus Policy</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Foundify AI operates strictly within Parul University, Vadodara. Reports from outside institutions are not accepted.
          </p>
        </div>
      </div>

      {/* Security Hotline Footer */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-bold text-[#0F172A]">Security HQ Vault</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
            24/7 OPEN
          </span>
        </div>
        <p className="text-[10px] text-[#64748B]">
          Building C5 Room 102 · Campus Security Ext: <strong>102</strong>
        </p>
      </div>
    </aside>
  );
};
