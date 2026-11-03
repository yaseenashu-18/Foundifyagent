import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  PhoneIncoming, 
  Clock, 
  Zap, 
  ArrowUpDown,
  FileSpreadsheet,
  Database,
  RefreshCw
} from 'lucide-react';
import { CallRecord, FoundifyVertical, CallStatus } from '../types/telephony';
import { ServiceChip } from './ServiceChip';

interface CallRecordsProps {
  calls: CallRecord[];
  onSelectCall: (call: CallRecord) => void;
  selectedVertical?: FoundifyVertical | 'All';
  onSelectVertical?: (vert: FoundifyVertical | 'All') => void;
}

export const CallRecords: React.FC<CallRecordsProps> = ({
  calls: initialCalls,
  onSelectCall,
  selectedVertical = 'All',
  onSelectVertical,
}) => {
  const [dbCalls, setDbCalls] = useState<CallRecord[]>(initialCalls);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'timestamp' | 'duration' | 'latency'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [internalVertical, setInternalVertical] = useState<FoundifyVertical | 'All'>(selectedVertical);

  const fetchLiveCalls = () => {
    fetch('/api/telephony/calls')
      .then((r) => r.json())
      .then((data) => {
        if (data.calls && Array.isArray(data.calls) && data.calls.length > 0) {
          setDbCalls(data.calls);
        }
      })
      .catch((e) => console.warn('Call ledger db fetch notice:', e));
  };

  useEffect(() => {
    fetchLiveCalls();
  }, []);

  const activeVertical = onSelectVertical ? selectedVertical : internalVertical;

  const handleVerticalChange = (v: FoundifyVertical | 'All') => {
    if (onSelectVertical) {
      onSelectVertical(v);
    } else {
      setInternalVertical(v);
    }
  };

  const filteredCalls = useMemo(() => {
    return dbCalls.filter((c) => {
      const matchesVertical = activeVertical === 'All' || c.vertical === activeVertical;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        c.callerName.toLowerCase().includes(query) ||
        c.callerId.toLowerCase().includes(query) ||
        c.callSid.toLowerCase().includes(query) ||
        c.intent.toLowerCase().includes(query) ||
        c.vertical.toLowerCase().includes(query);

      return matchesVertical && matchesStatus && matchesSearch;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'timestamp') {
        comparison = new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'duration') {
        comparison = b.durationSeconds - a.durationSeconds;
      } else if (sortBy === 'latency') {
        comparison = a.latencyMs - b.latencyMs;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });
  }, [dbCalls, selectedVertical, statusFilter, searchQuery, sortBy, sortOrder]);

  const handleExportCsv = () => {
    const headers = ['Call SID', 'Caller Name', 'Caller ID', 'Vertical', 'Voice Model', 'Status', 'Duration (s)', 'Latency (ms)', 'Intent', 'Resolution'];
    const rows = filteredCalls.map(c => [
      c.callSid,
      `"${c.callerName}"`,
      c.callerId,
      c.vertical,
      c.voiceModel,
      c.status,
      c.durationSeconds,
      c.latencyMs,
      `"${c.intent}"`,
      `"${c.resolution}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foundify-call-records-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verticalsList: (FoundifyVertical | 'All')[] = [
    'All',
    'Lost & Found',
    'Marketplace',
    'Rentals',
    'Services',
    'Giveaways'
  ];

  return (
    <div className="space-y-4">
      {/* Filters & Search Control Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Caller ID, Name, Keyword, or Intent..."
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
          </div>

          {/* Status & Export Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded-lg">
              <Filter className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#1E293B] focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Transferred">Transferred</option>
                <option value="Dropped">Dropped</option>
              </select>
            </div>

            <button
              onClick={handleExportCsv}
              className="h-10 px-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Foundify Vertical Segmented Control */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-[#F1F5F9] overflow-x-auto">
          <span className="text-xs font-semibold text-[#64748B] mr-1 flex-shrink-0">
            Vertical Filter:
          </span>
          {verticalsList.map((vert) => (
            <button
              key={vert}
              onClick={() => handleVerticalChange(vert)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors flex-shrink-0 ${
                activeVertical === vert
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              {vert}
            </button>
          ))}
        </div>
      </div>

      {/* Main Call Log Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Header: Height 36px, uppercase label-sm tracking with #64748B, background #F8FAFC, bottom border 1px solid #E2E8F0 */}
              <tr className="h-9 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-semibold uppercase tracking-wider text-[#64748B] select-none">
                <th className="px-4 py-2 font-medium">Caller ID & Contact</th>
                <th className="px-4 py-2 font-medium">Service Category</th>
                <th className="px-4 py-2 font-medium">Voice Model</th>
                <th className="px-4 py-2 font-medium">
                  <button 
                    onClick={() => {
                      if (sortBy === 'duration') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('duration'); setSortOrder('desc'); }
                    }}
                    className="flex items-center gap-1 hover:text-[#0F172A]"
                  >
                    <span>Duration</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-2 font-medium">
                  <button 
                    onClick={() => {
                      if (sortBy === 'latency') setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
                      else { setSortBy('latency'); setSortOrder('asc'); }
                    }}
                    className="flex items-center gap-1 hover:text-[#0F172A]"
                  >
                    <span>Latency Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-2 font-medium">Status / Outcome</th>
                <th className="px-4 py-2 font-medium">Timestamp</th>
                <th className="px-4 py-2 font-medium text-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#94A3B8] text-xs">
                    No telephony records match the selected vertical and search criteria.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => onSelectCall(call)}
                    className="h-12 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer group text-xs text-[#1E293B]"
                  >
                    {/* Caller ID */}
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                          {call.callerName}
                        </span>
                        <span className="font-mono text-[11px] text-[#64748B]">
                          {call.callerId}
                        </span>
                      </div>
                    </td>

                    {/* Foundify Vertical Chip */}
                    <td className="px-4 py-2">
                      <ServiceChip vertical={call.vertical} size="sm" />
                    </td>

                    {/* Voice Model */}
                    <td className="px-4 py-2 text-[#475569]">
                      <span className="truncate max-w-[140px] block font-medium">
                        {call.voiceModel}
                      </span>
                    </td>

                    {/* Duration in data-mono-sm */}
                    <td className="px-4 py-2 font-mono text-[12px] tabular-nums font-medium text-[#0F172A]">
                      {call.durationFormatted}
                    </td>

                    {/* Latency Score */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5 font-mono text-[12px] tabular-nums">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            call.latencyMs < 180
                              ? 'bg-[#10B981]'
                              : call.latencyMs < 210
                              ? 'bg-[#2563EB]'
                              : 'bg-[#F59E0B]'
                          }`}
                        />
                        <span className="font-semibold text-[#0F172A]">{call.latencyMs}ms</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          call.status === 'Completed'
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                            : call.status === 'Transferred'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-2 text-[#64748B] text-[11px]">
                      {call.dateFormatted}
                    </td>

                    {/* Inspect Link */}
                    <td className="px-4 py-2 text-right">
                      <span className="inline-flex items-center text-[#2563EB] font-medium text-xs group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Telemetry Summary */}
        <div className="h-10 px-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span>
            Showing <strong className="text-[#0F172A]">{filteredCalls.length}</strong> of{' '}
            <strong className="text-[#0F172A]">{dbCalls.length}</strong> telephony sessions
          </span>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Avg Latency: <strong className="text-[#10B981]">182ms</strong></span>
            <span>·</span>
            <span>Containment: <strong className="text-[#2563EB]">88.4%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
