import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Building2, 
  Plus, 
  ShieldCheck, 
  Clock, 
  ChevronRight, 
  RefreshCw,
  PhoneCall,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LostFoundReport } from '../types/campus';
import { PARUL_CAMPUS_LOCATIONS } from '../data/parulCampusData';

interface CampusDatabaseViewProps {
  onSelectReport: (report: LostFoundReport) => void;
  onOpenNewReportModal: () => void;
  onTriggerCallForReport?: (report: LostFoundReport) => void;
}

export const CampusDatabaseView: React.FC<CampusDatabaseViewProps> = ({
  onSelectReport,
  onOpenNewReportModal,
  onTriggerCallForReport,
}) => {
  const [reports, setReports] = useState<LostFoundReport[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<'all' | 'lost' | 'found'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      let url = '/api/reports?';
      if (selectedType !== 'all') url += `type=${selectedType}&`;
      if (selectedBuilding !== 'all') url += `building=${encodeURIComponent(selectedBuilding)}&`;
      if (selectedStatus !== 'all') url += `status=${encodeURIComponent(selectedStatus)}&`;
      if (searchQuery.trim()) url += `search=${encodeURIComponent(searchQuery.trim())}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error('Error fetching reports:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedType, selectedBuilding, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Parul University Campus Registry
            </span>
            <span className="text-[11px] font-mono text-zinc-400">·</span>
            <span className="text-[11px] text-zinc-500">Live Database</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Lost & Found Campus Items
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Browse active lost belongings and recovered inventory across engineering blocks, Central Library A27, food courts, and hostel zones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchReports}
            className="h-9 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-xl border border-zinc-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={onOpenNewReportModal}
            className="h-9 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculator, AirPods, student ID, L Block, library..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
            />
          </div>

          <button
            type="submit"
            className="h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
          {/* Item Type Switcher */}
          <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200/60">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'all' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedType('lost')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'lost' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Lost Only
            </button>
            <button
              onClick={() => setSelectedType('found')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                selectedType === 'found' ? 'bg-white text-zinc-900 shadow-2xs' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Found Only
            </button>
          </div>

          {/* Building Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-lg text-zinc-700">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Campus Blocks</option>
              {PARUL_CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  [{loc.code}] {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-lg text-zinc-700">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Under Review">Under Review</option>
              <option value="Matched">Matched</option>
              <option value="Handover to Security">Handover to Security</option>
              <option value="Recovered">Recovered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white border border-zinc-200/80 rounded-2xl">
            <Building2 className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-900">No Campus Reports Found</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              No active lost or found records match your filter criteria. Try refining your search query or selecting a different campus block.
            </p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white border border-zinc-200/80 hover:border-zinc-400 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Meta Header */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className={`font-semibold ${
                      report.type === 'found' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {report.type === 'found' ? 'Found Item' : 'Lost Item'}
                    </span>
                    <span className="text-zinc-300">·</span>
                    <span className="font-mono text-zinc-500">#{report.id}</span>
                  </div>

                  {report.securityHandover?.isHandedOver && (
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      In Vault
                    </span>
                  )}
                </div>

                {/* Optional Image */}
                {report.images && report.images.length > 0 && (
                  <div className="w-full h-32 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 mb-3">
                    <img
                      src={report.images[0]}
                      alt={report.itemName}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                )}

                <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
                  {report.itemName}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">
                    [{report.location.buildingCode}] {report.location.buildingName}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-zinc-400">
                  {report.dateFormatted}
                </span>

                <div className="flex items-center gap-2">
                  {onTriggerCallForReport && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerCallForReport(report);
                      }}
                      className="px-2 py-1 rounded-md bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Dispatch AI Call to verify item"
                    >
                      <PhoneCall className="w-3 h-3 text-zinc-600" />
                      <span>AI Call</span>
                    </button>
                  )}
                  <span className="font-medium text-zinc-900 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
