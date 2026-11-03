export type FoundifyVertical = 
  | 'Lost & Found'
  | 'Marketplace'
  | 'Rentals'
  | 'Services'
  | 'Giveaways';

export type HumanVoiceName = 
  | 'Aoede'
  | 'Puck'
  | 'Charon';

export type VoiceModel = 
  | 'Gemini 3.8 Live (Live API)'
  | 'ElevenLabs Flash v2.5'
  | 'Retell Turbo HD'
  | 'Deepgram Nova-2 + Aura'
  | 'Cartesia Sonic Enterprise';

export type CallStatus = 'Completed' | 'Live' | 'Transferred' | 'Dropped' | 'Ringing';

export type Sentiment = 'Positive' | 'Neutral' | 'Frustrated' | 'Resolved';

export interface TranscriptTurn {
  id: string;
  speaker: 'agent' | 'caller' | 'user';
  text: string;
  timestamp: string;
  latencyMs?: number;
  confidence?: number;
  audioUrl?: string;
  voiceName?: HumanVoiceName;
}

export interface ExtractedEntity {
  label: string;
  value: string;
  category: string;
  confidence: number;
}

export interface CallRecord {
  id: string;
  callSid: string;
  callerId: string;
  callerName: string;
  vertical: FoundifyVertical;
  campusLocation?: string;
  voiceModel: VoiceModel;
  status: CallStatus;
  durationSeconds: number;
  durationFormatted: string;
  latencyMs: number;
  packetJitterMs: number;
  timestamp: string;
  dateFormatted: string;
  sentiment: Sentiment;
  intent: string;
  summary: string;
  resolution: string;
  entities: ExtractedEntity[];
  transcript: TranscriptTurn[];
  costUsd: number;
  sipTrunk: string;
}

export interface OutboundQueueItem {
  id: string;
  studentName: string;
  enrollmentNo: string;
  department: string;
  phone: string;
  matchedItem: string;
  itemCategory: string;
  locationFound: string;
  buildingCode: string;
  matchConfidence: number;
  priority: 'Urgent' | 'High' | 'Standard';
  callReason: string;
  status: 'Queued' | 'Dialing' | 'Connected' | 'Completed' | 'Callback Needed';
  assignedVoice: HumanVoiceName;
  language: 'en' | 'hi' | 'te';
  scheduledTime: string;
  photoUrl?: string;
  scenarioType: 'match_alert' | 'security_vault' | 'custom';
}

export interface AgentPromptConfig {
  id: string;
  vertical: FoundifyVertical;
  title: string;
  systemPrompt: string;
  temperature: number;
  speechRate: number;
  bargeInSensitivity: number; // 0 to 100
  selectedVoice: string;
  latencyTargetMs: number;
  toolsEnabled: string[];
}

export interface PhoneNumberRecord {
  id: string;
  number: string;
  country: string;
  vertical: FoundifyVertical;
  assignedAgent: string;
  sipUri: string;
  status: 'Active' | 'Routing' | 'Maintenance';
  monthlyMinutes: number;
  lastActive: string;
}
