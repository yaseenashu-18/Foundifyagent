import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  Search, 
  ChevronRight, 
  ExternalLink,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { PARUL_CAMPUS_LOCATIONS } from '../data/parulCampusData';
import { CampusLocation } from '../types/campus';

interface CampusMapDirectoryProps {
  onAskAboutLocation: (buildingName: string) => void;
}

export const CampusMapDirectory: React.FC<CampusMapDirectoryProps> = ({
  onAskAboutLocation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState<string>('');

  const categories = ['All', 'Academic', 'Admin', 'Food Court', 'Hostel', 'Sports', 'Parking', 'Hospital', 'Landmark'];

  const filteredLocations = PARUL_CAMPUS_LOCATIONS.filter((loc) => {
    const matchesCat = selectedCategory === 'All' || loc.category === selectedCategory;
    const query = searchLocation.toLowerCase().trim();
    const matchesSearch = !query || 
      loc.code.toLowerCase().includes(query) ||
      loc.name.toLowerCase().includes(query) ||
      loc.description.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Campus Geographic Knowledge
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
              Parul University Map Index
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
            Parul University Campus Buildings & Zones
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified building identifiers (A1–A29, C1–C5, H1–H36, E1–E6, F, G, P1–P8) integrated into Foundify AI.
          </p>
        </div>

        {/* Security Vault Callout */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-3 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-[#1D4ED8] block">Central Lost &amp; Found Vault</span>
            <span className="text-[#64748B] text-[11px]">Building C5 (Security HQ Room 102)</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search campus code (e.g. A1, A24, A27), building name (PIET, Library), or zone..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Campus Map Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.map((loc) => (
          <div
            key={loc.code}
            className="bg-white border border-[#E2E8F0] hover:border-[#2563EB] rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-lg border border-[#BFDBFE]">
                  {loc.code}
                </span>
                <span className="text-[10px] font-semibold text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                  {loc.category}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                {loc.name}
              </h3>

              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                {loc.description}
              </p>

              {loc.floors && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {loc.floors.map((fl, i) => (
                    <span key={i} className="text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                      {fl}
                    </span>
                  ))}
                </div>
              )}

              {loc.securityCabinNearby && (
                <div className="mt-3 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{loc.securityCabinNearby}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
              <button
                onClick={() => onAskAboutLocation(loc.name)}
                className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Search Items Here</span>
              </button>

              <span className="text-[11px] font-mono text-[#94A3B8]">
                Parul Campus
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
