import React, { useState } from 'react';
import { 
  Sparkles, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Building2, 
  User, 
  ArrowRight, 
  Check, 
  Copy, 
  RefreshCw,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';
import { HumanVoiceName } from '../types/telephony';

export interface AiMatchRecord {
  id: string;
  lostReportId: string;
  foundReportId: string;
  title: string;
  category: 'Lost & Found' | 'Marketplace' | 'Rentals' | 'Services' | 'Giveaways';
  confidenceScore: number;
  matchReasons: string[];
  userInfo: {
    name: string;
    phone: string;
    department: string;
    enrollmentMasked: string;
    role: string;
  };
  lostDetails: {
    description: string;
    location: string;
    dateTime: string;
    color?: string;
    brand?: string;
  };
  foundDetails: {
    description: string;
    location: string;
    dateTime: string;
    vaultToken?: string;
    vaultLocation?: string;
    color?: string;
    brand?: string;
  };
  telephonyStatus: 'Pending Outbound Call' | 'Calling Now' | 'Verified Match' | 'Custody Vault Ready' | 'Needs Re-verification';
  assignedVoice: HumanVoiceName;
  lastCallTimestamp?: string;
  callNotes?: string;
}

export const INITIAL_AI_MATCHES: AiMatchRecord[] = [
  {
    id: 'AIM-PU-901',
    lostReportId: 'RPT-PU-LOST-041',
    foundReportId: 'RPT-PU-102',
    title: 'Apple AirPods Pro (2nd Gen) in White Case',
    category: 'Lost & Found',
    confidenceScore: 98,
    matchReasons: [
      'High-precision serial & hardware fingerprint match',
      'Yellow silicone carabiner loop specifically described by student',
      'Location correlation: Central Library A27, 2nd floor cubicle #18 within 45 min window',
      'Bluetooth pairing name matches Rohan Patel'
    ],
    userInfo: {
      name: 'Rohan Patel',
      phone: '+91 98765 43210',
      department: 'B.Tech Computer Science (PIET)',
      enrollmentMasked: 'PU-2023-CSE-0412',
      role: 'Student (Resident, Tagore H4)'
    },
    lostDetails: {
      description: 'Lost my white AirPods Pro case with small yellow silicone strap while studying at 2nd floor reading hall.',
      location: 'Central Library A27, 2nd Floor Digital Reading Hall',
      dateTime: 'Yesterday, 17:30',
      color: 'White',
      brand: 'Apple'
    },
    foundDetails: {
      description: 'White wireless earbuds in charging case with yellow silicone strap handed in by student attendant.',
      location: 'Central Library A27 Turnstile Security Desk',
      dateTime: 'Yesterday, 18:15',
      vaultToken: 'PU-SEC-8821',
      vaultLocation: 'C5 Security HQ Property Vault Room 102',
      color: 'White',
      brand: 'Apple'
    },
    telephonyStatus: 'Pending Outbound Call',
    assignedVoice: 'Aoede',
    callNotes: 'Scheduled autonomous outbound notification call.'
  },
  {
    id: 'AIM-PU-902',
    lostReportId: 'RPT-PU-LOST-038',
    foundReportId: 'RPT-PU-101',
    title: 'Casio ClassWiz FX-991CW Scientific Calculator',
    category: 'Lost & Found',
    confidenceScore: 96,
    matchReasons: [
      'Faint initials "R.K." engraved near rear battery door match Rahul Kulkarni',
      'Location match: PIET A1 Room 204 Electronics Lab front podium',
      'Time interval: Reported 10:15 AM, found during 11:30 AM practical session'
    ],
    userInfo: {
      name: 'Rahul Kulkarni',
      phone: '+91 94281 77302',
      department: 'B.Tech Electrical & Electronics (PIT)',
      enrollmentMasked: 'PU-2023-EEE-0194',
      role: 'Student (Day Scholar)'
    },
    lostDetails: {
      description: 'Black scientific calculator left on bench in Room 204. Has initials "R.K." engraved faintly.',
      location: 'PIET Building A1, Room 204 (Electronics Lab)',
      dateTime: 'Today, 10:15',
      color: 'Black',
      brand: 'Casio'
    },
    foundDetails: {
      description: 'Black calculator handed in to lab in-charge.',
      location: 'PIET Building A1 Porch Security Cabin',
      dateTime: 'Today, 11:30',
      vaultToken: 'PU-SEC-8790',
      vaultLocation: 'A1 Porch Security Cabin',
      color: 'Black',
      brand: 'Casio'
    },
    telephonyStatus: 'Pending Outbound Call',
    assignedVoice: 'Puck',
    callNotes: 'AI agent will confirm student pickup at A1 Porch Desk.'
  },
  {
    id: 'AIM-PU-903',
    lostReportId: 'RPT-PU-LOST-044',
    foundReportId: 'RPT-PU-107',
    title: 'Dell 65W USB-C Laptop Charger Adapter',
    category: 'Lost & Found',
    confidenceScore: 94,
    matchReasons: [
      'Genuine Dell original 65W adapter with rubber cable tie',
      'Reported left on outdoor study bench near Nescafe circle',
      'Recovered by cafeteria cleaning team at 11:45 AM'
    ],
    userInfo: {
      name: 'Aman Deep Singh',
      phone: '+91 98112 34567',
      department: 'B.Tech Mechanical (PIET)',
      enrollmentMasked: 'PU-2022-MECH-0819',
      role: 'Student (Resident, Kalam H12)'
    },
    lostDetails: {
      description: 'Black Dell 65W charger with round rubber cord tie left near Nescafe bench.',
      location: 'Nescafe Circle F2 Outdoor Study Benches',
      dateTime: 'Today, 11:00',
      color: 'Black',
      brand: 'Dell'
    },
    foundDetails: {
      description: 'Original Dell USB-C charger deposited at cafeteria register.',
      location: 'Nescafe Circle F2 Cashier Counter',
      dateTime: 'Today, 11:45',
      vaultToken: 'PU-SEC-8902',
      vaultLocation: 'C5 Security HQ Property Vault Room 102',
      color: 'Black',
      brand: 'Dell'
    },
    telephonyStatus: 'Verified Match',
    assignedVoice: 'Aoede',
    lastCallTimestamp: 'Today, 12:15 PM',
    callNotes: 'Student verified via automated AI call. Retrieval token PU-SEC-8902 sent.'
  },
  {
    id: 'AIM-PU-904',
    lostReportId: 'RPT-PU-MKT-019',
    foundReportId: 'RPT-PU-MKT-024',
    title: 'Engineering Mechanics by Timoshenko (5th Edition)',
    category: 'Marketplace',
    confidenceScore: 92,
    matchReasons: [
      'Direct buyer-to-seller match for 1st Year B.Tech textbooks',
      'Asking price ₹250 matches student budget preference ₹200-₹300',
      'Campus handover location mutually convenient at Gate 1 Student Center P1'
    ],
    userInfo: {
      name: 'Kunal Verma',
      phone: '+91 97241 88392',
      department: 'Mechanical Engineering (PIET)',
      enrollmentMasked: 'PU-2024-MECH-0912',
      role: 'Student'
    },
    lostDetails: {
      description: 'Looking to buy Timoshenko Mechanics in good condition for upcoming mid-semester exams.',
      location: 'Gate 1 Student Two-Wheeler Parking Area P1',
      dateTime: 'Today, 09:30',
    },
    foundDetails: {
      description: 'Selling 5th edition Mechanics book with neat handwritten formulas. Available immediately.',
      location: 'Tagore Bhavan Boys Hostel H4',
      dateTime: 'Today, 10:15',
      vaultLocation: 'Gate 1 Campus Drop Point',
    },
    telephonyStatus: 'Pending Outbound Call',
    assignedVoice: 'Puck',
    callNotes: 'AI agent will call buyer to confirm inspection meeting at Gate 1.'
  },
  {
    id: 'AIM-PU-905',
    lostReportId: 'RPT-PU-RNT-008',
    foundReportId: 'RPT-PU-RNT-011',
    title: 'Rotring Drafting Machine / Mini Drafter for Drawing Lab',
    category: 'Rentals',
    confidenceScore: 95,
    matchReasons: [
      'Drawing exam scheduled tomorrow 9:00 AM at Bhagat Singh Bhawan A24',
      'Matched verified resident with available mini drafter in Kalam Hostel H12',
      'Daily rental rate ₹40/day agreed with ₹150 refundable security deposit'
    ],
    userInfo: {
      name: 'Pooja Trivedi',
      phone: '+91 91062 88411',
      department: 'Architecture & Civil Drafting (Bhagat Singh Bhawan A24)',
      enrollmentMasked: 'PU-2023-ARCH-0331',
      role: 'Student (Resident, Sarojini H20)'
    },
    lostDetails: {
      description: 'Urgent rental required: Standard mini drafter for civil drafting submission tomorrow.',
      location: 'Bhagat Singh Bhawan A24 Drafting Studios',
      dateTime: 'Today, 13:00',
    },
    foundDetails: {
      description: 'Mini drafter in hard plastic carrying case available for 3-day rental.',
      location: 'Kalam Bhavan Boys Hostel H12 Wing B',
      dateTime: 'Today, 13:20',
      vaultLocation: 'A24 Entrance Desk Drop Box',
    },
    telephonyStatus: 'Pending Outbound Call',
    assignedVoice: 'Charon',
    callNotes: 'Agent outbound call to coordinate locker pickup pass at A24 Entrance.'
  },
  {
    id: 'AIM-PU-906',
    lostReportId: 'RPT-PU-GIV-002',
    foundReportId: 'RPT-PU-GIV-005',
    title: 'White Cotton Lab Apron / Coat (Size M) for Chemistry Practical',
    category: 'Giveaways',
    confidenceScore: 97,
    matchReasons: [
      'Senior graduating student free giveaway donation matched with incoming 1st year student',
      'Pickup location at Applied Sciences B-Block Ground Floor Lockers',
      'Zero cost peer giveaway with automated locker PIN code generation'
    ],
    userInfo: {
      name: 'Ananya Deshmukh',
      phone: '+91 99240 11928',
      department: 'Faculty of Pharmacy (A3)',
      enrollmentMasked: 'PU-2024-PHARM-0119',
      role: 'Student'
    },
    lostDetails: {
      description: 'In need of clean white lab coat for pharmaceutical organic chemistry lab sessions.',
      location: 'Faculty of Pharmacy A3 Ground Floor',
      dateTime: 'Today, 08:45',
    },
    foundDetails: {
      description: 'Free freshly laundered lab coat donated for juniors. Clean and stain-free.',
      location: 'B-Block Applied Sciences Student Donation Bin',
      dateTime: 'Yesterday, 16:30',
      vaultToken: 'GIVEAWAY-B-201',
      vaultLocation: 'B-Block Lockers Room 12',
    },
    telephonyStatus: 'Custody Vault Ready',
    assignedVoice: 'Aoede',
    callNotes: 'AI agent will dispatch SMS notification with locker pickup code.'
  }
];

interface OutboundAiMatchesSectionProps {
  onInitiateCall: (target: {
    phone: string;
    studentName: string;
    scenario: 'match_alert' | 'security_vault' | 'custom';
    voice?: HumanVoiceName;
    itemTitle?: string;
    matchScore?: number;
    matchId?: string;
    lostLocation?: string;
    foundLocation?: string;
    identifyingFeature?: string;
    vaultToken?: string;
    category?: string;
  }) => void;
  isCallLive?: boolean;
}

export const OutboundAiMatchesSection: React.FC<OutboundAiMatchesSectionProps> = ({
  onInitiateCall,
  isCallLive = false,
}) => {
  const [matches, setMatches] = useState<AiMatchRecord[]>(INITIAL_AI_MATCHES);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleTriggerCall = (match: AiMatchRecord) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id ? { ...m, telephonyStatus: 'Calling Now' } : m
      )
    );

    onInitiateCall({
      phone: match.userInfo.phone,
      studentName: match.userInfo.name,
      scenario: match.foundDetails.vaultToken ? 'security_vault' : 'match_alert',
      voice: match.assignedVoice,
      itemTitle: match.title,
      matchScore: match.confidenceScore,
      matchId: match.id,
      lostLocation: match.lostDetails.location,
      foundLocation: match.foundDetails.location,
      identifyingFeature: match.matchReasons[0] || 'Corroborated item details',
      vaultToken: match.foundDetails.vaultToken,
      category: match.category,
    });
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.userInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.userInfo.phone.includes(searchQuery) ||
      match.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.foundDetails.vaultToken && match.foundDetails.vaultToken.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      filterCategory === 'All' || match.category === filterCategory;

    const matchesStatus =
      filterStatus === 'All' || match.telephonyStatus === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Database Match Dispatcher
            </span>
            <span className="text-[11px] font-mono text-zinc-400">·</span>
            <span className="text-[11px] text-zinc-500">Parul University Records</span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Outbound AI Matches & Phone Dispatch
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Correlates lost reports with found item inventory and student phone numbers in the database. Dispatches autonomous AI voice notifications with exact location context.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://foundify-9osq.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-xl border border-zinc-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Official Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Total AI Matches
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            {matches.length}
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Across 5 campus verticals
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Pending Outbound
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            {matches.filter((m) => m.telephonyStatus === 'Pending Outbound Call').length}
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Ready for AI voice contact
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Match Accuracy
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            95.3%
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            Location & mark correlation
          </span>
        </div>

        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4">
          <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
            Vault Ready
          </span>
          <div className="text-2xl font-semibold text-zinc-900 mt-1 tabular-nums">
            {matches.filter((m) => m.telephonyStatus === 'Custody Vault Ready' || m.telephonyStatus === 'Verified Match').length}
          </div>
          <span className="text-[11px] text-zinc-400 mt-0.5 block">
            C5 Room 102 tokens logged
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phone number (+91...), student name, or item..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-3 text-xs font-medium bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-700 cursor-pointer focus:outline-none"
          >
            <option value="All">All Foundify Verticals</option>
            <option value="Lost & Found">Lost & Found</option>
            <option value="Marketplace">Marketplace</option>
            <option value="Rentals">Rentals</option>
            <option value="Services">Services</option>
            <option value="Giveaways">Giveaways</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 text-xs font-medium bg-zinc-50 border border-zinc-200/80 rounded-xl text-zinc-700 cursor-pointer focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Outbound Call">Pending Outbound Call</option>
            <option value="Calling Now">Calling Now</option>
            <option value="Verified Match">Verified Match</option>
            <option value="Custody Vault Ready">Custody Vault Ready</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-12 text-center">
            <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-zinc-900">No AI Matches Found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try refining your search query or phone number filter.</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const isTargetCalling = match.telephonyStatus === 'Calling Now';
            return (
              <div
                key={match.id}
                className="bg-white border border-zinc-200/80 hover:border-zinc-400 rounded-2xl p-5 shadow-2xs transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                        {match.id}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {match.category}
                      </span>
                      {match.foundDetails.vaultToken && (
                        <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Token: {match.foundDetails.vaultToken}
                        </span>
                      )}
                    </div>
                    <h2 className="font-semibold text-base text-zinc-900">{match.title}</h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                        Match Score
                      </div>
                      <div className="font-mono text-sm font-semibold text-zinc-900">
                        {match.confidenceScore}% Match
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      match.telephonyStatus === 'Pending Outbound Call'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : match.telephonyStatus === 'Calling Now'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 animate-sf-pulse'
                        : match.telephonyStatus === 'Custody Vault Ready'
                        ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {match.telephonyStatus}
                    </span>
                  </div>
                </div>

                {/* Database Student Info & Phone Call Action */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-medium text-xs">
                      {match.userInfo.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-zinc-900">{match.userInfo.name}</span>
                        <span className="text-[11px] text-zinc-400 font-mono">({match.userInfo.enrollmentMasked})</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">{match.userInfo.department} · {match.userInfo.role}</p>
                    </div>
                  </div>

                  {/* Database Phone & Call Trigger */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg flex items-center gap-2">
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
                        DB Phone:
                      </span>
                      <span className="font-mono font-semibold text-xs text-zinc-900">
                        {match.userInfo.phone}
                      </span>
                      <button
                        onClick={() => handleCopyPhone(match.userInfo.phone)}
                        className="text-zinc-400 hover:text-zinc-700 p-0.5"
                        title="Copy phone"
                      >
                        {copiedPhone === match.userInfo.phone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleTriggerCall(match)}
                      disabled={isCallLive}
                      className={`h-9 px-3.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                        isTargetCalling
                          ? 'bg-emerald-600 text-white animate-sf-pulse'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      }`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{isTargetCalling ? 'Calling Now...' : 'Call User Now (AI Agent)'}</span>
                    </button>
                  </div>
                </div>

                {/* Match Comparison: Lost vs Found Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <div className="flex items-center justify-between text-zinc-500 font-medium text-[11px]">
                      <span>Lost Report Record ({match.lostReportId})</span>
                      <span className="font-mono text-zinc-400">{match.lostDetails.dateTime}</span>
                    </div>
                    <p className="text-zinc-800 leading-relaxed text-xs">{match.lostDetails.description}</p>
                    <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-1">
                      <Building2 className="w-3 h-3 text-zinc-400" />
                      <span>Lost at: {match.lostDetails.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                    <div className="flex items-center justify-between text-zinc-500 font-medium text-[11px]">
                      <span>Found Item Intake ({match.foundReportId})</span>
                      <span className="font-mono text-zinc-400">{match.foundDetails.dateTime}</span>
                    </div>
                    <p className="text-zinc-800 leading-relaxed text-xs">{match.foundDetails.description}</p>
                    <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px] pt-1">
                      <Building2 className="w-3 h-3 text-zinc-400" />
                      <span>Found at: {match.foundDetails.location}</span>
                    </div>
                  </div>
                </div>

                {/* AI Evidence Corroboration */}
                <div className="p-3 rounded-xl bg-zinc-50/60 border border-zinc-100 text-xs space-y-1">
                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>AI Corroboration Rationale</span>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 list-disc text-zinc-600 text-[11px]">
                    {match.matchReasons.map((reason, idx) => (
                      <li key={idx} className="leading-snug">{reason}</li>
                    ))}
                  </ul>
                  {match.callNotes && (
                    <div className="mt-1.5 pt-1.5 border-t border-zinc-200/60 text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-zinc-400" />
                      <span>Dispatch notes: {match.callNotes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
