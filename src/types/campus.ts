export type CampusReportStatus = 
  | 'Reported'
  | 'Under Review'
  | 'Matched'
  | 'Contact Initiated'
  | 'Handover to Security'
  | 'Recovered'
  | 'Closed';

export type CampusItemCategory = 
  | 'Electronics'
  | 'Personal Belongings'
  | 'Academic & College ID'
  | 'Keys & Access'
  | 'Clothing & Footwear'
  | 'Sports & Equipment'
  | 'Books & Notes'
  | 'Other';

export interface CampusLocation {
  code: string; // e.g. "A1", "A24", "A27", "H4", "F1", "P2"
  name: string; // e.g. "Parul Institute of Engineering & Technology (PIET)"
  category: 'Academic' | 'Hostel' | 'Hospital' | 'Food Court' | 'Sports' | 'Parking' | 'Admin' | 'Landmark';
  description: string;
  floors?: string[];
  securityCabinNearby?: string;
}

export interface LostFoundReport {
  id: string; // e.g. "RPT-PU-101"
  type: 'lost' | 'found';
  itemName: string;
  category: CampusItemCategory;
  description: string;
  color?: string;
  brand?: string;
  identifyingMarks?: string;
  location: {
    campus: 'Parul University, Vadodara';
    buildingCode: string;
    buildingName: string;
    floor?: string;
    roomOrArea?: string;
    landmark?: string;
  };
  dateTime: string;
  dateFormatted: string;
  status: CampusReportStatus;
  reportedBy: {
    name: string;
    role: 'Student' | 'Faculty' | 'Campus Security' | 'Staff';
    department: string;
    enrollmentMasked: string; // e.g. "PU-2023-CSE-****"
  };
  images?: string[];
  securityHandover?: {
    isHandedOver: boolean;
    deskLocation: string; // e.g. "Central Security Cabin (Near Gate 1)"
    handoverDate: string;
    tokenNumber: string;
    officerBadge: string;
  };
  matchedReportId?: string;
  matchScore?: number;
  matchReason?: string;
}

export interface UserSession {
  name: string;
  enrollmentNo: string;
  department: string;
  university: 'Parul University, Vadodara';
  hostel?: string;
  avatarUrl: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  language?: 'en' | 'hi' | 'te';
  actionTaken?: {
    type: string;
    title: string;
    status: 'success' | 'pending' | 'info';
  };
  reportCards?: LostFoundReport[];
  audioUrl?: string;
  isGroundedWithGoogleSearch?: boolean;
  groundingSources?: { title: string; uri: string }[];
}

export type SystemDomain = 
  | 'lost_found'
  | 'rentals'
  | 'marketplace'
  | 'services'
  | 'giveaways';

export interface SystemUserInfo {
  userName: string;
  userPhone: string;
  userEmailOrId: string; // Enrollment ID or college email
  departmentOrHostel: string;
  role?: 'Student' | 'Faculty' | 'Staff' | 'Campus Security';
}

export interface RegisteredSystemItem {
  id: string; // e.g. "REG-PU-RENT-409", "REG-PU-MKT-102"
  domain: SystemDomain;
  title: string;
  description: string;
  category: string;
  condition?: 'Brand New' | 'Like New' | 'Good' | 'Fair' | 'Functional';
  location: {
    campus: 'Parul University, Vadodara';
    buildingCode: string;
    buildingName: string;
    floor?: string;
    roomOrArea?: string;
    landmark?: string;
  };
  userInfo: SystemUserInfo;
  pricingOrTerms: {
    priceOrRate: number; // ₹
    deposit?: number; // ₹ (for rentals)
    rateUnit?: 'per_day' | 'per_week' | 'fixed' | 'per_hour' | 'free';
    negotiable?: boolean;
    availabilityOrExpiry?: string;
  };
  status: string; // e.g., 'Available', 'Active Rental', 'Reported', 'Matched', 'Sold', 'Claimed', 'In Vault'
  dateTime: string;
  dateFormatted: string;
  images?: string[];
  trackingCode: string;
}

export interface SystemChangeAudit {
  changeId: string;
  itemId: string;
  itemTitle: string;
  domain: SystemDomain;
  changeType: 'status_update' | 'item_registered' | 'price_adjusted' | 'inspection_scheduled' | 'security_handover' | 'claim_verified' | 'rental_returned';
  previousStatus?: string;
  newStatus: string;
  notes: string;
  auditSummary: string;
  reportedBy: 'ai_calling_agent' | 'host_copilot' | 'automated_insight_engine';
  timestamp: string;
  dateFormatted: string;
}

export interface AutomatedInsightTrigger {
  id: string;
  domain: SystemDomain;
  priority: 'Urgent' | 'High' | 'Standard';
  title: string;
  triggerReason: string;
  studentName: string;
  studentPhone: string;
  enrollmentNo: string;
  departmentOrHostel: string;
  relatedItemId?: string;
  relatedItemTitle: string;
  campusLocation: string;
  suggestedAction: string;
  urgencyScore: number; // 0-100
  createdAt: string;
  status: 'Pending' | 'Auto-Dialing' | 'Completed' | 'Dismissed';
}

export interface RegistrationChecklistState {
  userName: string | null;
  userPhone: string | null;
  userEmailOrId: string | null;
  departmentOrHostel: string | null;
  domain: SystemDomain | null;
  itemTitle: string | null;
  description: string | null;
  condition: string | null;
  campusLocation: string | null;
  priceOrDeposit: string | null;
  isFullyRegistered: boolean;
  registeredId?: string;
}

export interface ManualHostCallingConfig {
  studentName: string;
  studentPhone: string;
  departmentOrHostel: string;
  enrollmentId: string;
  domain: SystemDomain;
  hostBriefingNotes: string;
  callMode: 'autonomous_ai' | 'host_copilot_listen' | 'host_takeover';
  selectedVoice: string;
  selectedLanguage: 'en' | 'hi' | 'te';
}

export type AssistantVoiceState = 
  | 'idle'
  | 'listening'
  | 'processing'
  | 'performing_action'
  | 'speaking'
  | 'error';

