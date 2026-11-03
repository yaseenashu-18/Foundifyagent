import { CallRecord, AgentPromptConfig, PhoneNumberRecord, OutboundQueueItem } from '../types/telephony';

export const INITIAL_OUTBOUND_QUEUE: OutboundQueueItem[] = [
  {
    id: 'queue-pu-01',
    studentName: 'Rohan Patel',
    enrollmentNo: 'PU-2023-BTECH-CSE-0412',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 43210',
    matchedItem: 'Apple AirPods Pro (2nd Gen) in White Case',
    itemCategory: 'Electronics',
    locationFound: 'Central Library A27, 2nd Floor Cubicle 18',
    buildingCode: 'A27',
    matchConfidence: 96,
    priority: 'Urgent',
    callReason: 'High confidence match found for reported lost AirPods with yellow silicone strap',
    status: 'Queued',
    assignedVoice: 'Aoede',
    language: 'en',
    scheduledTime: 'Immediate Dispatch',
    photoUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    scenarioType: 'match_alert',
  },
  {
    id: 'queue-pu-02',
    studentName: 'Sneha Sharma',
    enrollmentNo: 'PU-2024-IT-0891',
    department: 'Information Technology',
    phone: '+91 98251 12345',
    matchedItem: 'Parul University Official ID Lanyard',
    itemCategory: 'Academic & College ID',
    locationFound: 'Food Court F1, Subway Counter Table #4',
    buildingCode: 'F1',
    matchConfidence: 98,
    priority: 'High',
    callReason: 'Student ID card handed over by cafeteria supervisor; verification required',
    status: 'Queued',
    assignedVoice: 'Aoede',
    language: 'hi',
    scheduledTime: 'Next in Queue',
    photoUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    scenarioType: 'security_vault',
  },
  {
    id: 'queue-pu-03',
    studentName: 'Aditya Dave',
    enrollmentNo: 'PU-2023-ECE-0194',
    department: 'Electronics & Communication',
    phone: '+91 97123 45678',
    matchedItem: 'Casio ClassWiz FX-991CW Calculator',
    itemCategory: 'Academic & College ID',
    locationFound: 'PIET A1 Engineering Hub, Room 204 Lab',
    buildingCode: 'A1',
    matchConfidence: 94,
    priority: 'Standard',
    callReason: 'Calculator with initials R.K. engraved deposited in Room 204 bench',
    status: 'Queued',
    assignedVoice: 'Puck',
    language: 'en',
    scheduledTime: 'Today, 14:30',
    photoUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    scenarioType: 'match_alert',
  },
  {
    id: 'queue-pu-04',
    studentName: 'Deepak Chaudhary',
    enrollmentNo: 'PU-2022-BARCH-0052',
    department: 'Architecture & Design',
    phone: '+91 94280 65432',
    matchedItem: 'Wildhorn Brown Leather Bi-fold Wallet',
    itemCategory: 'Personal Belongings',
    locationFound: 'Bhagat Singh Bhawan A24, 1st Floor Corridor',
    buildingCode: 'A24',
    matchConfidence: 92,
    priority: 'Urgent',
    callReason: 'Wallet with Driving License and PU Metro card awaiting custody clearance',
    status: 'Queued',
    assignedVoice: 'Charon',
    language: 'hi',
    scheduledTime: 'Today, 15:00',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    scenarioType: 'match_alert',
  },
  {
    id: 'queue-pu-05',
    studentName: 'Kunal Joshi',
    enrollmentNo: 'PU-2023-ME-0611',
    department: 'Mechanical Engineering',
    phone: '+91 99090 87654',
    matchedItem: 'Fastrack Stainless Steel Water Bottle',
    itemCategory: 'Personal Belongings',
    locationFound: 'Sports Ground G1 Pavilion Spectator Benches',
    buildingCode: 'G1',
    matchConfidence: 89,
    priority: 'Standard',
    callReason: 'Matte blue bottle with coding stickers claimed by resident of Tagore Hostel H4',
    status: 'Queued',
    assignedVoice: 'Charon',
    language: 'en',
    scheduledTime: 'Today, 15:45',
    photoUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    scenarioType: 'custom',
  },
];

export const INITIAL_CALL_RECORDS: CallRecord[] = [
  {
    id: 'call-pu-1049',
    callSid: 'CA-PU-9f482a0910cbe7781b94e334fa12a',
    callerId: '+91 98765 43210',
    callerName: 'Rohan Patel',
    vertical: 'Lost & Found',
    campusLocation: 'Central Library A27 / Building C5 Vault',
    voiceModel: 'Gemini 3.8 Live (Live API)',
    status: 'Completed',
    durationSeconds: 142,
    durationFormatted: '02:22',
    latencyMs: 148,
    packetJitterMs: 1.1,
    timestamp: '2026-11-03T02:15:12Z',
    dateFormatted: 'Today, 02:15',
    sentiment: 'Resolved',
    intent: 'Verify match for AirPods Pro 2nd Gen with yellow carabiner',
    summary: 'Autonomous AI outbound call dispatched to student Rohan Patel regarding white Apple AirPods Pro found at Central Library A27. Agent verified the identifying yellow silicone loop strap, matched serial profile, and confirmed deposit into Central Security Vault (Building C5 Room 102). Security Token #SEC-VAULT-2026-8841 sent via encrypted SMS.',
    resolution: 'Ownership verified; Security token #SEC-VAULT-2026-8841 issued for C5 Vault pickup',
    entities: [
      { label: 'Item Match', value: 'AirPods Pro 2nd Gen (White)', category: 'Hardware', confidence: 0.99 },
      { label: 'Identifier', value: 'Yellow silicone carabiner loop', category: 'Marking', confidence: 0.98 },
      { label: 'Campus Location', value: 'Central Library A27, 2nd Floor', category: 'CampusGeo', confidence: 0.97 },
      { label: 'Deposit Vault', value: 'Building C5 Room 102 (Officer Mahendra Rathod)', category: 'Security', confidence: 0.99 },
    ],
    transcript: [
      { id: 't1', speaker: 'agent', text: 'Hello Rohan! This is Foundify AI, calling on behalf of Parul University Central Security. I am reaching out regarding a report of your lost white AirPods.', timestamp: '00:01', latencyMs: 145 },
      { id: 't2', speaker: 'caller', text: 'Hi! Yes! Did someone find my AirPods? I have been looking everywhere since yesterday.', timestamp: '00:07' },
      { id: 't3', speaker: 'agent', text: 'Yes, a pair of Apple AirPods Pro 2nd Gen in a white charging case was deposited from Central Library A27, second floor reading hall. Can you confirm if your case had any specific accessories?', timestamp: '00:15', latencyMs: 142 },
      { id: 't4', speaker: 'caller', text: 'Yes! It has a bright yellow silicone strap with a small metal carabiner ring attached.', timestamp: '00:23' },
      { id: 't5', speaker: 'agent', text: 'That is an exact match. Pooja Nair from B.Pharm turned them over, and they are safely logged in the Building C5 Central Security Vault under Token number SEC-VAULT-2026-8841.', timestamp: '00:32', latencyMs: 150 },
      { id: 't6', speaker: 'caller', text: 'That is amazing! Can you send me the claim pass so I can show it to the officer?', timestamp: '00:39' },
      { id: 't7', speaker: 'agent', text: 'I just dispatched your official recovery pass to your mobile phone. You can collect it from Officer Mahendra Rathod at Building C5 with your Parul University student ID card.', timestamp: '00:46', latencyMs: 148 },
      { id: 't8', speaker: 'caller', text: 'Thank you so much Foundify!', timestamp: '00:51' },
      { id: 't9', speaker: 'agent', text: 'Glad to help, Rohan. Have a wonderful day at Parul University!', timestamp: '00:55', latencyMs: 138 }
    ],
    costUsd: 0.038,
    sipTrunk: 'pu-trunk-01.sip.foundify.ai'
  },
  {
    id: 'call-pu-1048',
    callSid: 'CA-PU-8e321b8829ade6670a83d223fe09b',
    callerId: '+91 97123 45678',
    callerName: 'Aditya Dave',
    vertical: 'Lost & Found',
    campusLocation: 'PIET Engineering Hub A1',
    voiceModel: 'Gemini 3.8 Live (Live API)',
    status: 'Completed',
    durationSeconds: 110,
    durationFormatted: '01:50',
    latencyMs: 154,
    packetJitterMs: 1.0,
    timestamp: '2026-11-03T01:45:00Z',
    dateFormatted: 'Today, 01:45',
    sentiment: 'Positive',
    intent: 'Confirm calculator handover in PIET Room 204',
    summary: 'Outbound check with finder Aditya Dave regarding Casio ClassWiz FX-991CW calculator found in Room 204 Electronics Lab. Verified details and logged intake record #RPT-PU-101.',
    resolution: 'Item logged into PIET Porch security station registry',
    entities: [
      { label: 'Item Name', value: 'Casio ClassWiz FX-991CW', category: 'Stationery', confidence: 0.99 },
      { label: 'Location', value: 'PIET A1 Room 204 Podium', category: 'Academic', confidence: 0.96 },
      { label: 'Engraving', value: 'Initials R.K.', category: 'Identifier', confidence: 0.95 },
    ],
    transcript: [
      { id: 't1', speaker: 'agent', text: 'Good afternoon Aditya, Foundify AI calling from Parul University Lost & Found. Thank you for reporting a calculator found in PIET A1.', timestamp: '00:01', latencyMs: 150 },
      { id: 't2', speaker: 'caller', text: 'Hey, yes! I left it with the PIET ground floor security desk right before my class.', timestamp: '00:08' },
      { id: 't3', speaker: 'agent', text: 'Confirmed. We have updated report RPT-PU-101 with the desk log. We will automatically notify students whose profiles match the engraved initials.', timestamp: '00:16', latencyMs: 152 },
      { id: 't4', speaker: 'caller', text: 'Awesome, thanks for the update.', timestamp: '00:21' }
    ],
    costUsd: 0.029,
    sipTrunk: 'pu-trunk-01.sip.foundify.ai'
  },
  {
    id: 'call-pu-1047',
    callSid: 'CA-PU-7d210a7718zce5569z72c112ed98a',
    callerId: '+91 98251 12345',
    callerName: 'Sneha Sharma',
    vertical: 'Lost & Found',
    campusLocation: 'Food Court F1 Subway Area',
    voiceModel: 'Gemini 3.8 Live (Live API)',
    status: 'Completed',
    durationSeconds: 95,
    durationFormatted: '01:35',
    latencyMs: 142,
    packetJitterMs: 0.9,
    timestamp: '2026-11-03T01:10:20Z',
    dateFormatted: 'Today, 01:10',
    sentiment: 'Resolved',
    intent: 'Inbound inquiry on lost Parul University ID lanyard',
    summary: 'Student called Parul University Helpline Ext 102 inquiring about ID card lost near Food Court F1. Agent matched report RPT-PU-103 with the Food Court security point and scheduled desk pickup.',
    resolution: 'ID Card located at Food Court entrance security cabin',
    entities: [
      { label: 'Item', value: 'Blue PU Lanyard + ID (IT Dept)', category: 'IDCard', confidence: 0.99 },
      { label: 'Campus Spot', value: 'Food Court F1 Subway Table #4', category: 'Dining', confidence: 0.97 },
      { label: 'Status', value: 'Ready for Collection', category: 'Resolution', confidence: 1.0 },
    ],
    transcript: [
      { id: 't1', speaker: 'agent', text: 'Parul University Lost and Found Helpline. How can I assist you today?', timestamp: '00:01', latencyMs: 140 },
      { id: 't2', speaker: 'caller', text: 'Hello, I lost my Parul University ID card somewhere in Food Court F1 during lunch.', timestamp: '00:07' },
      { id: 't3', speaker: 'agent', text: 'I see a report logged 25 minutes ago for an IT department student ID card on a blue lanyard found near the Subway counter. Does your enrollment number end in 0891?', timestamp: '00:15', latencyMs: 144 },
      { id: 't4', speaker: 'caller', text: 'Yes, that is mine! Where can I pick it up?', timestamp: '00:20' },
      { id: 't5', speaker: 'agent', text: 'You can collect it directly from the Food Court entrance security point. Havildar Ramesh has it in the registry log.', timestamp: '00:27', latencyMs: 141 },
      { id: 't6', speaker: 'caller', text: 'Thank you so much!', timestamp: '00:30' }
    ],
    costUsd: 0.025,
    sipTrunk: 'pu-trunk-02.sip.foundify.ai'
  },
  {
    id: 'call-pu-1046',
    callSid: 'CA-PU-6c109z6607ybd4458y61b001dc87z',
    callerId: '+91 (2668) 260-312',
    callerName: 'Officer Mahendra Rathod',
    vertical: 'Lost & Found',
    campusLocation: 'Central Security HQ (Building C5)',
    voiceModel: 'Gemini 3.8 Live (Live API)',
    status: 'Completed',
    durationSeconds: 164,
    durationFormatted: '02:44',
    latencyMs: 140,
    packetJitterMs: 0.8,
    timestamp: '2026-11-02T23:54:19Z',
    dateFormatted: 'Yesterday, 23:54',
    sentiment: 'Positive',
    intent: 'Daily security vault custody ledger reconciliation',
    summary: 'Autonomous telephony sync with Security Vault Room 102 officer. Reconciled 4 newly handed over items: AirPods Pro, Bike Key ring (Gate 1), Casio calculator, and Brown wallet from A24.',
    resolution: 'All 4 items successfully indexed into Foundify Parul Campus Registry',
    entities: [
      { label: 'Security Officer', value: 'Mahendra Rathod (Badge #312)', category: 'Authority', confidence: 1.0 },
      { label: 'Items Synced', value: '4 Custodial Deposits', category: 'Inventory', confidence: 0.99 },
      { label: 'Vault Room', value: 'Building C5 Room 102', category: 'Vault', confidence: 0.99 },
    ],
    transcript: [
      { id: 't1', speaker: 'agent', text: 'Foundify Automated Dispatch connecting to Central Security Desk Building C5. Ready for custody reconciliation.', timestamp: '00:01', latencyMs: 138 },
      { id: 't2', speaker: 'caller', text: 'Good evening AI desk. Confirming token SEC-VAULT-2026-8841 for the AirPods and SEC-GATE1-KEYS-094 for the Honda bike keys.', timestamp: '00:10' },
      { id: 't3', speaker: 'agent', text: 'Both tokens verified and linked to claimant verification queues. Outbound calls to verified owners are scheduled for dispatch.', timestamp: '00:18', latencyMs: 142 },
      { id: 't4', speaker: 'caller', text: 'Understood. All items secured in Vault Locker 3.', timestamp: '00:23' }
    ],
    costUsd: 0.042,
    sipTrunk: 'pu-trunk-01.sip.foundify.ai'
  },
  {
    id: 'call-pu-1045',
    callSid: 'CA-PU-5b098y5596xac3347x50a990cb76y',
    callerId: '+91 94280 65432',
    callerName: 'Deepak Chaudhary',
    vertical: 'Lost & Found',
    campusLocation: 'Bhagat Singh Bhawan A24',
    voiceModel: 'Gemini 3.8 Live (Live API)',
    status: 'Completed',
    durationSeconds: 88,
    durationFormatted: '01:28',
    latencyMs: 156,
    packetJitterMs: 1.2,
    timestamp: '2026-11-02T22:30:10Z',
    dateFormatted: 'Yesterday, 22:30',
    sentiment: 'Resolved',
    intent: 'Match notification: Wildhorn brown leather wallet',
    summary: 'Outbound AI notification to Architecture student Deepak Chaudhary. Confirmed wallet found outside Studio 104 in A24 Bhagat Singh Bhawan. Issued recovery token.',
    resolution: 'Verified match; claimant pass issued',
    entities: [
      { label: 'Brand', value: 'Wildhorn Leather', category: 'Item', confidence: 0.98 },
      { label: 'Building', value: 'A24 Bhagat Singh Bhawan', category: 'CampusGeo', confidence: 0.99 },
    ],
    transcript: [
      { id: 't1', speaker: 'agent', text: 'Hello Deepak, this is Foundify AI calling from Parul University. We have a confirmed match for your lost brown leather wallet.', timestamp: '00:01', latencyMs: 152 },
      { id: 't2', speaker: 'caller', text: 'Oh fantastic! Does it have my Gujarat driving license inside?', timestamp: '00:07' },
      { id: 't3', speaker: 'agent', text: 'Yes, your driving license and student library slip were confirmed by the A24 housekeeping supervisor. The wallet is at the A24 security entrance desk.', timestamp: '00:15', latencyMs: 155 },
      { id: 't4', speaker: 'caller', text: 'Relief! I will head there first thing tomorrow morning.', timestamp: '00:21' }
    ],
    costUsd: 0.024,
    sipTrunk: 'pu-trunk-01.sip.foundify.ai'
  }
];

export const SYSTEM_PROMPTS: Record<string, AgentPromptConfig> = {
  'Lost & Found': {
    id: 'prompt-pu-campus-01',
    vertical: 'Lost & Found',
    title: 'Parul University Campus Voice Calling Agent',
    systemPrompt: `You are Foundify AI, the official intelligent voice calling assistant for Foundify, restricted EXCLUSIVELY to Parul University, Vadodara, Gujarat, India.

CRITICAL CAMPUS RULES:
1. Support ONLY Parul University. Never accept reports or discuss items from any other university.
2. Resolve locations using actual campus identifiers:
   - Academic: A1 (PIET Engineering), A2 (PIT), A3 (Pharmacy), A4 (FMS), A24 (Bhagat Singh Bhawan), A25 (C.V. Raman Centre), A27 (Central Library), A Block, B Block, C Block, D Block.
   - Admin & Security: C1 (Admin), C3 (Exam), C5 (Central Security HQ & Vault Room 102).
   - Food Courts: F1 (Food Fiesta), F2 (Nescafe Circle), F3 (Hostel Mess).
   - Hostels: H4 (Tagore), H12 (Kalam), H20 (Sarojini Naidu Girls), H32 (International).
   - Hospital: E1 (Parul Sevashram Hospital).
   - Sports: G1 (Cricket/Football Ground), G2 (Indoor Sports).
   - Parking: P1 (Gate 1), P2 (Library), P3 (Hostel Bay).
3. If user asks about off-campus or non-lost-and-found matters (e.g. general homework, coding help, other colleges), politely deflect: "Foundify AI is strictly dedicated to lost and found belongings across Parul University campus."
4. Human Voice Quality: Sound natural, empathetic, crisp, and concise like ChatGPT Voice. Use spoken Telugu, Hindi, or English as requested.
5. In outbound calls, introduce as Foundify AI from Parul University, state the matched item, ask 1 relevant clarifying question at a time, and coordinate pickup or vault handover with tokens.`,
    temperature: 0.25,
    speechRate: 1.0,
    bargeInSensitivity: 85,
    selectedVoice: 'Aoede (Warm & Natural Conversational Human Voice)',
    latencyTargetMs: 180,
    toolsEnabled: ['queryCampusDatabase', 'generateVaultToken', 'dispatchStudentSmsPass', 'transferToSecurityOfficer']
  },
  'Marketplace': {
    id: 'prompt-pu-mp',
    vertical: 'Marketplace',
    title: 'Parul Student Marketplace Desk',
    systemPrompt: 'Campus student exchange and textbook marketplace assistant for Parul University students.',
    temperature: 0.3,
    speechRate: 1.0,
    bargeInSensitivity: 75,
    selectedVoice: 'Puck (Friendly & Dynamic Human Voice)',
    latencyTargetMs: 180,
    toolsEnabled: ['queryListings', 'verifyStudentId']
  },
  'Rentals': {
    id: 'prompt-pu-rn',
    vertical: 'Rentals',
    title: 'Campus Bicycle & Lab Locker Rental Agent',
    systemPrompt: 'Coordinates campus EV cycle stations and student research locker access at Parul University.',
    temperature: 0.3,
    speechRate: 1.0,
    bargeInSensitivity: 80,
    selectedVoice: 'Charon (Authoritative & Deep Human Voice)',
    latencyTargetMs: 170,
    toolsEnabled: ['cycleLockerCode', 'checkCycleStatus']
  },
  'Services': {
    id: 'prompt-pu-sv',
    vertical: 'Services',
    title: 'Campus Maintenance & IT Support Dispatch',
    systemPrompt: 'Campus hostel electrician, plumber, and lab workstation maintenance dispatch.',
    temperature: 0.2,
    speechRate: 1.05,
    bargeInSensitivity: 90,
    selectedVoice: 'Charon (Authoritative & Deep Human Voice)',
    latencyTargetMs: 150,
    toolsEnabled: ['dispatchTechnician', 'checkHostelTicket']
  },
  'Giveaways': {
    id: 'prompt-pu-gw',
    vertical: 'Giveaways',
    title: 'Campus Senior-to-Junior Book & Stationery Giveaways',
    systemPrompt: 'Facilitates textbook, lab coats, drafter, and stationery donations between graduating seniors and junior batches at Parul University.',
    temperature: 0.35,
    speechRate: 1.0,
    bargeInSensitivity: 70,
    selectedVoice: 'Aoede (Expressive & Melodic Human Voice)',
    latencyTargetMs: 200,
    toolsEnabled: ['postDonation', 'matchStudentBatch']
  }
};

export const PHONE_NUMBERS: PhoneNumberRecord[] = [
  {
    id: 'pn-pu-1',
    number: '+91 (2668) 260-312',
    country: 'IN',
    vertical: 'Lost & Found',
    assignedAgent: 'Parul University Central Lost & Found Helpline (Ext 102)',
    sipUri: 'sip:lostfound@trunk.paruluniversity.ac.in',
    status: 'Active',
    monthlyMinutes: 12450,
    lastActive: 'Just now'
  },
  {
    id: 'pn-pu-2',
    number: '+91 (2668) 260-204',
    country: 'IN',
    vertical: 'Lost & Found',
    assignedAgent: 'PIET Engineering Hub A1 Desk (Ext 204)',
    sipUri: 'sip:piet-desk@trunk.paruluniversity.ac.in',
    status: 'Active',
    monthlyMinutes: 8320,
    lastActive: '4 min ago'
  },
  {
    id: 'pn-pu-3',
    number: '+91 (2668) 260-270',
    country: 'IN',
    vertical: 'Lost & Found',
    assignedAgent: 'Central Library A27 Knowledge Desk (Ext 270)',
    sipUri: 'sip:library-desk@trunk.paruluniversity.ac.in',
    status: 'Active',
    monthlyMinutes: 9810,
    lastActive: '2 min ago'
  },
  {
    id: 'pn-pu-4',
    number: '+91 (2668) 260-501',
    country: 'IN',
    vertical: 'Lost & Found',
    assignedAgent: 'Central Security Vault HQ Building C5 (Ext 501)',
    sipUri: 'sip:security-vault@trunk.paruluniversity.ac.in',
    status: 'Active',
    monthlyMinutes: 15400,
    lastActive: 'Just now'
  },
  {
    id: 'pn-pu-5',
    number: '+91 (2668) 260-401',
    country: 'IN',
    vertical: 'Lost & Found',
    assignedAgent: 'Hostel Resident Property Desk H4 Tagore (Ext 401)',
    sipUri: 'sip:hostel-desk@trunk.paruluniversity.ac.in',
    status: 'Active',
    monthlyMinutes: 4200,
    lastActive: '18 min ago'
  }
];

export const TELEMETRY_METRICS = {
  totalCallsToday: 412,
  avgHandleTimeSeconds: 114,
  avgHandleTimeFormatted: '1m 54s',
  p95FirstByteLatencyMs: 148,
  resolutionRatePercent: 94.2,
  costPerMinuteUsd: 0.024,
  activeLiveCalls: 3,
  sipPacketLossRate: 0.01,
  verticalBreakdown: [
    { vertical: 'Lost & Found', count: 328, share: 80, avgDuration: '1m 58s', latency: '142ms', color: '#2563EB' },
    { vertical: 'Security Vault', count: 48, share: 12, avgDuration: '2m 10s', latency: '150ms', color: '#10B981' },
    { vertical: 'Helpline Inbound', count: 36, share: 8, avgDuration: '1m 32s', latency: '138ms', color: '#F59E0B' },
  ],
  hourlyLatency: [
    { hour: '08:00', latency: 140, calls: 24 },
    { hour: '10:00', latency: 146, calls: 68 },
    { hour: '12:00', latency: 152, calls: 112 },
    { hour: '14:00', latency: 145, calls: 98 },
    { hour: '16:00', latency: 148, calls: 74 },
    { hour: '18:00', latency: 142, calls: 36 }
  ]
};
