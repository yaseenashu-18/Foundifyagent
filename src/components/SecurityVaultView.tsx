import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  PhoneCall, 
  ExternalLink,
  Search,
  Check,
  Copy,
  ArrowUpRight
} from 'lucide-react';
import { LostFoundReport } from '../types/campus';

interface SecurityVaultViewProps {
  onSelectReport: (report: LostFoundReport) => void;
  onTriggerCallForReport?: (report: LostFoundReport) => void;
}

export const SecurityVaultView: React.FC<SecurityVaultViewProps> = ({ 
  onSelectReport,
  onTriggerCallForReport,
}) => {
  const [vaultReports, setVaultReports] = useState<LostFoundReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenSearch, setTokenSearch] = useState<string>('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/reports?status=Handover%20to%20Security')
      .then((r) => r.json())
      .then((data) => {
        setVaultReports(data.reports || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (token: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredReports = vaultReports.filter((r) => {
    if (!tokenSearch.trim()) return true;
    const query = tokenSearch.toLowerCase().trim();
    return (
      r.itemName.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query) ||
      (r.securityHandover?.tokenNumber && r.securityHandover.tokenNumber.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Official Foundify Redirect */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Campus Security Custody
            </span>
            <span className="text-[11px] font-mono text-zinc-400">·</span>
            <span className="text-[11px] text-zinc-500 font-mono">Building C5 Room 102</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Parul Central Property Vault
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            High-value items (AirPods, laptops, wallets, ID cards) deposited with authorized campus security. Claim with physical student ID and token.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Official Foundify Redirect Link */}
          <a
            href="https://foundify-9osq.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <span>Official Foundify Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300" />
          </a>

          <div className="bg-zinc-50 border border-zinc-200/80 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600 text-xs">C5 Security Desk · Gate 1</span>
          </div>
        </div>
      </div>

      {/* Token Verification & Procedure Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Token Search Bar */}
        <div className="md:col-span-2 bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verify Security Custody Token</span>
            </div>
            <p className="text-xs text-zinc-500">
              Enter the custody token code (e.g. PU-SEC-8821 or SEC-VAULT-2026-8841) to locate the registered item.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tokenSearch}
              onChange={(e) => setTokenSearch(e.target.value)}
              placeholder="Search token code or item name..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Claim Steps */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 text-xs space-y-1.5">
          <span className="font-semibold text-zinc-900 text-xs">Student Pickup Protocol</span>
          <ol className="list-decimal pl-4 space-y-1 text-zinc-600 text-[11px] leading-relaxed">
            <li>Visit Building C5 Ground Floor, Room 102.</li>
            <li>Present physical Parul University Student ID card.</li>
            <li>Quote assigned custody token number for immediate handover.</li>
          </ol>
        </div>
      </div>

      {/* Vault Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-full py-14 text-center bg-white border border-zinc-200/80 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-900">No Items Found</h3>
            <p className="text-xs text-zinc-500 mt-1">No items currently match this custody token search.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white border border-zinc-200/80 hover:border-zinc-400 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    In Vault Custody
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">#{report.id}</span>
                </div>

                {report.images && report.images.length > 0 && (
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-zinc-100 mb-3 border border-zinc-100">
                    <img src={report.images[0]} alt={report.itemName} className="w-full h-full object-cover" />
                  </div>
                )}

                <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-zinc-700 transition-colors">
                  {report.itemName}
                </h3>

                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                  {report.description}
                </p>

                {report.securityHandover && (
                  <div className="mt-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                        Custody Token
                      </span>
                      <button
                        onClick={(e) => handleCopy(report.securityHandover!.tokenNumber, e)}
                        className="text-zinc-400 hover:text-zinc-700 p-0.5"
                        title="Copy token"
                      >
                        {copiedToken === report.securityHandover.tokenNumber ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                    <span className="font-mono font-semibold text-zinc-900 block truncate text-xs">
                      {report.securityHandover.tokenNumber}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-0.5 truncate">
                      {report.securityHandover.deskLocation}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px] font-mono">{report.dateFormatted}</span>
                <div className="flex items-center gap-2">
                  {onTriggerCallForReport && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerCallForReport(report);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="AI Call Claimant for Vault Pickup"
                    >
                      <PhoneCall className="w-3 h-3 text-zinc-300" />
                      <span>Dispatch Call</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
