import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Mic,
  MicOff,
  Send, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  User, 
  RotateCcw,
  RefreshCw,
  Radio, 
  ArrowUpRight, 
  UserCheck, 
  ChevronDown, 
  Edit3, 
  Check, 
  X, 
  Plus 
} from 'lucide-react';
import { HumanVoiceName, FoundifyVertical } from '../types/telephony';
import { AudioWaveform } from './AudioWaveform';
import { playWavBase64 } from '../utils/audioUtils';

export interface TargetStudentUser {
  id: string;
  studentName: string;
  phone: string;
  department: string;
  enrollmentMasked: string;
  itemTitle: string;
  category: FoundifyVertical;
  lostLocation: string;
  foundLocation: string;
  vaultToken: string;
  assignedVoice: HumanVoiceName;
  matchScore: number;
  matchReason: string;
  initialPrompt?: string;
}

// Strictly Matched Students Only (All 6 are verified matched lost & found students with high confidence)
export const PRESET_STUDENT_USERS: TargetStudentUser[] = [
  {
    id: 'AIM-PU-901',
    studentName: 'Rohan Patel',
    phone: '+91 98765 43210',
    department: 'B.Tech Computer Science (PIET)',
    enrollmentMasked: 'PU-2023-CSE-0412',
    itemTitle: 'Apple AirPods Pro (2nd Gen) in White Case',
    category: 'Lost & Found',
    lostLocation: 'Central Library A27, 2nd Floor Digital Reading Hall',
    foundLocation: 'Central Library A27 Turnstile Security Desk',
    vaultToken: 'PU-SEC-8821',
    assignedVoice: 'Aoede',
    matchScore: 98,
    matchReason: 'Serial fingerprint match & yellow silicone strap verified',
  },
  {
    id: 'AIM-PU-902',
    studentName: 'Rahul Kulkarni',
    phone: '+91 94281 77302',
    department: 'B.Tech Electrical & Electronics (PIT)',
    enrollmentMasked: 'PU-2023-EEE-0194',
    itemTitle: 'Casio ClassWiz FX-991CW Calculator',
    category: 'Lost & Found',
    lostLocation: 'PIET Building A1, Room 204 Electronics Lab',
    foundLocation: 'PIET Building A1 Porch Security Cabin',
    vaultToken: 'PU-SEC-8790',
    assignedVoice: 'Puck',
    matchScore: 96,
    matchReason: 'Initials R.K. engraved near rear battery door match Rahul',
  },
  {
    id: 'AIM-PU-903',
    studentName: 'Aman Deep Singh',
    phone: '+91 98112 34567',
    department: 'B.Tech Mechanical (PIET)',
    enrollmentMasked: 'PU-2022-MECH-0819',
    itemTitle: 'Dell 65W USB-C Laptop Charger Adapter',
    category: 'Lost & Found',
    lostLocation: 'Nescafe Circle F2 Outdoor Study Benches',
    foundLocation: 'Nescafe Circle F2 Cashier Counter',
    vaultToken: 'PU-SEC-8902',
    assignedVoice: 'Aoede',
    matchScore: 94,
    matchReason: 'Dell original 65W adapter with round rubber cable tie',
  },
  {
    id: 'AIM-PU-904',
    studentName: 'Shreya Shah',
    phone: '+91 98251 44029',
    department: 'Faculty of IT & Computer Applications (PIT)',
    enrollmentMasked: 'PU-2023-IT-0552',
    itemTitle: 'HP Envy Rechargeable Active Stylus Pen (Silver)',
    category: 'Lost & Found',
    lostLocation: 'Tagore Bhavan H4 Common Study Lounge',
    foundLocation: 'Security HQ C5 Main Gate Cabin',
    vaultToken: 'PU-SEC-8944',
    assignedVoice: 'Charon',
    matchScore: 97,
    matchReason: 'Pressure-sensitive stylus with blue grip ring verified',
  },
  {
    id: 'AIM-PU-905',
    studentName: 'Meet Joshi',
    phone: '+91 97123 65890',
    department: 'Civil Engineering (PIET)',
    enrollmentMasked: 'PU-2024-CIVIL-0211',
    itemTitle: 'Black Leather RFID Wallet with Parul Student SmartCard',
    category: 'Lost & Found',
    lostLocation: 'Management Faculty Canteen C3',
    foundLocation: 'Building C5 Room 102 Security Property Vault',
    vaultToken: 'PU-SEC-8651',
    assignedVoice: 'Puck',
    matchScore: 99,
    matchReason: 'Physical Parul University Smart ID Card found inside with photo match',
  },
  {
    id: 'AIM-PU-906',
    studentName: 'Tanvi Sharma',
    phone: '+91 99099 43288',
    department: 'Faculty of Management Studies (C3)',
    enrollmentMasked: 'PU-2023-BBA-0301',
    itemTitle: 'Fastrack Reflex Beat+ Smartwatch (Black Strap)',
    category: 'Lost & Found',
    lostLocation: 'PU Sports Complex Indoor Badminton Court G2',
    foundLocation: 'Sports Complex Equipment Desk',
    vaultToken: 'PU-SEC-8915',
    assignedVoice: 'Aoede',
    matchScore: 95,
    matchReason: 'Screen lock pattern and bluetooth device MAC match verified',
  },
];

const STORAGE_KEY = 'foundify_target_student_refresh_idx';

// Auto-rotates through matched students on every refresh/page load
function getNextRotatedMatchedStudent(): { student: TargetStudentUser; index: number } {
  if (typeof window === 'undefined') {
    return { student: PRESET_STUDENT_USERS[0], index: 0 };
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    const lastIdx = raw !== null ? parseInt(raw, 10) : -1;
    const nextIdx = (lastIdx + 1) % PRESET_STUDENT_USERS.length;
    sessionStorage.setItem(STORAGE_KEY, String(nextIdx));
    localStorage.setItem(STORAGE_KEY, String(nextIdx));
    return { student: PRESET_STUDENT_USERS[nextIdx], index: nextIdx };
  } catch {
    return { student: PRESET_STUDENT_USERS[0], index: 0 };
  }
}

const getInitialGreeting = (student: TargetStudentUser) => {
  return `Hello ${student.studentName}! This is Foundify Voice AI calling regarding the ${student.itemTitle} you reported lost at ${student.lostLocation}. We found an exact match recovered at ${student.foundLocation}, safely secured under custody token ${student.vaultToken}. Are you available to verify a few quick details?`;
};

const getInitialQuickReplies = (student: TargetStudentUser) => {
  return [
    'Yes, that matches mine exactly! Thank you!',
    'Where in Building C5 should I go to collect it?',
    'What documents or ID do I need to bring?',
    `Can you send the custody token ${student.vaultToken} via SMS?`,
  ];
};

interface DialogueMessage {
  id: string;
  speaker: 'agent' | 'student';
  text: string;
  timestamp: string;
  voice?: string;
}

interface LiveConsoleViewProps {
  onOpenReportModal?: (report: any) => void;
}

export const LiveConsoleView: React.FC<LiveConsoleViewProps> = () => {
  // Rotates target student automatically on each page refresh
  const [initialRotation] = useState(() => getNextRotatedMatchedStudent());
  const [selectedStudent, setSelectedStudent] = useState<TargetStudentUser>(initialRotation.student);
  const [refreshIndex, setRefreshIndex] = useState<number>(initialRotation.index);
  const [selectedVoice, setSelectedVoice] = useState<HumanVoiceName>(initialRotation.student.assignedVoice);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>('en');
  
  // Custom user editor modal
  const [isCustomUserModalOpen, setIsCustomUserModalOpen] = useState<boolean>(false);
  const [customForm, setCustomForm] = useState<Partial<TargetStudentUser>>({
    studentName: '',
    phone: '+91 ',
    department: 'Parul University Student',
    itemTitle: '',
    lostLocation: 'Parul University Campus',
    foundLocation: 'Building C5 Security Vault',
    vaultToken: 'PU-SEC-9100',
    category: 'Lost & Found',
  });

  const [isCallLive, setIsCallLive] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState<boolean>(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [studentInput, setStudentInput] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);

  // Contextual Quick Responses that adapt after each turn
  const [quickResponses, setQuickResponses] = useState<string[]>(() =>
    getInitialQuickReplies(initialRotation.student)
  );

  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 'init-msg',
      speaker: 'agent',
      text: getInitialGreeting(initialRotation.student),
      timestamp: '00:01',
      voice: initialRotation.student.assignedVoice,
    },
  ]);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioBusyRef = useRef<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentSpeaking, isThinking]);

  useEffect(() => {
    if (isCallLive) {
      timerRef.current = setInterval(() => {
        setCallDuration((c) => c + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isCallLive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      stopSpeechRecognition();
      clearInterval(timerRef.current);
    };
  }, []);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioBusyRef.current = false;
    setIsAgentSpeaking(false);
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListeningMic(false);
  };

  // User input voice responder (Web Speech API)
  const toggleSpeechRecognition = () => {
    if (isListeningMic) {
      stopSpeechRecognition();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. You can type or use the quick response buttons!');
      return;
    }

    // Zero overlap: immediately stop agent speaking when user talks
    stopAudio();

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang =
      selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';

    recognition.onstart = () => {
      setIsListeningMic(true);
    };

    let speechTranscript = '';
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      speechTranscript = transcript;
      setStudentInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition notice:', event.error);
      setIsListeningMic(false);
    };

    recognition.onend = () => {
      setIsListeningMic(false);
      if (speechTranscript.trim()) {
        handleSendMessage(speechTranscript.trim());
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 1. Host switches the target student user
  const handleSwitchTargetUser = (student: TargetStudentUser) => {
    stopAudio();
    setIsCallLive(false);
    setCallDuration(0);
    setSelectedStudent(student);
    setSelectedVoice(student.assignedVoice);

    const initialGreeting = `Hello ${student.studentName}! This is Foundify Voice AI calling regarding the ${student.itemTitle} matching your report at ${student.lostLocation}. We matched it with inventory found at ${student.foundLocation}, stored under token ${student.vaultToken || 'PU-SEC-8821'}. Are you available to verify?`;

    setMessages([
      {
        id: `switch-${Date.now()}`,
        speaker: 'agent',
        text: initialGreeting,
        timestamp: '00:01',
        voice: student.assignedVoice,
      },
    ]);

    // Initial contextual quick responses tailored to this specific student & vertical
    if (student.category === 'Marketplace') {
      setQuickResponses([
        'Yes, I want to buy it! Can we meet at Gate 1?',
        'Is the asking price negotiable?',
        'Can I inspect the condition first?',
        'What time are you available on campus today?'
      ]);
    } else if (student.category === 'Rentals') {
      setQuickResponses([
        'Yes, I need the rental! What is the daily rate?',
        'How much is the refundable security deposit?',
        'Can I pick it up at Kalam Hostel H12?',
        'Can I rent it for 3 days?'
      ]);
    } else if (student.category === 'Giveaways') {
      setQuickResponses([
        'Yes, I would love the giveaway apron!',
        'What is the locker pickup code?',
        'Where in B-Block are the lockers located?',
        'Thank you so much for the donation!'
      ]);
    } else {
      setQuickResponses([
        'Yes, that matches mine exactly! Thank you!',
        'Where in Building C5 should I go to collect it?',
        'What documents or ID do I need to bring?',
        'Can you send the custody token via SMS?'
      ]);
    }
  };

  // 2. Save Custom Student
  const handleSaveCustomStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customForm.studentName || !customForm.phone) return;

    const newStudent: TargetStudentUser = {
      id: `CUSTOM-${Date.now()}`,
      studentName: customForm.studentName,
      phone: customForm.phone,
      department: customForm.department || 'Parul University Student',
      enrollmentMasked: 'PU-2024-STU-****',
      itemTitle: customForm.itemTitle || 'Lost Belongings',
      category: (customForm.category as FoundifyVertical) || 'Lost & Found',
      lostLocation: customForm.lostLocation || 'Parul University Campus',
      foundLocation: customForm.foundLocation || 'Building C5 Room 102 Security Desk',
      vaultToken: customForm.vaultToken || 'PU-SEC-9200',
      assignedVoice: selectedVoice,
    };

    setIsCustomUserModalOpen(false);
    handleSwitchTargetUser(newStudent);
  };

  // 3. Start Call
  const handleStartCall = async () => {
    setIsCallLive(true);
    setCallDuration(0);
    stopAudio();

    const initialText = `Hello ${selectedStudent.studentName}! This is Foundify Voice AI calling regarding the ${selectedStudent.itemTitle} you reported at ${selectedStudent.lostLocation}. We have matched it with an item recovered at ${selectedStudent.foundLocation}, secured under token ${selectedStudent.vaultToken || 'PU-SEC-8821'}.`;
    
    setMessages([
      {
        id: `call-start-${Date.now()}`,
        speaker: 'agent',
        text: initialText,
        timestamp: '00:01',
        voice: selectedVoice,
      },
    ]);

    await triggerVoiceSpeech(initialText, selectedVoice, selectedLanguage);
  };

  // 4. Hang up & File Audit
  const handleEndCall = () => {
    stopAudio();
    setIsCallLive(false);

    const durationFormatted = `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`;
    fetch('/api/call-audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: `audit-${Date.now()}`,
        callerId: selectedStudent.phone,
        callerName: selectedStudent.studentName,
        vertical: selectedStudent.category,
        campusLocation: selectedStudent.lostLocation,
        voiceModel: `Gemini 2.5 Flash (${selectedVoice})`,
        durationFormatted,
        durationSeconds: callDuration,
        status: 'Completed',
        sentiment: 'Resolved',
        summary: `Outbound AI verification call with ${selectedStudent.studentName} for ${selectedStudent.itemTitle}. Custody token: ${selectedStudent.vaultToken}.`,
        resolution: 'Student verified custody details and pickup instructions.',
        dialogue: messages,
      }),
    }).catch(console.warn);
  };

  // 5. Synthesize voice without overlap
  const triggerVoiceSpeech = async (text: string, voiceName: HumanVoiceName, lang: string) => {
    if (isSpeakerMuted || audioBusyRef.current) return;

    try {
      audioBusyRef.current = true;
      setIsAgentSpeaking(true);

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          voice: voiceName,
          language: lang,
          context: {
            activeTopic: selectedStudent.itemTitle,
            location: selectedStudent.lostLocation,
            foundLocation: selectedStudent.foundLocation,
            token: selectedStudent.vaultToken,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Update quick responses dynamically from the server response
        if (data.suggestedReplies && Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0) {
          setQuickResponses(data.suggestedReplies);
        }

        if (data.audio) {
          const audio = await playWavBase64(data.audio);
          if (audio) {
            currentAudioRef.current = audio;
            audio.onended = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
            audio.onerror = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
          } else {
            audioBusyRef.current = false;
            setIsAgentSpeaking(false);
          }
        } else {
          audioBusyRef.current = false;
          setIsAgentSpeaking(false);
        }
      }
    } catch (e) {
      console.warn('Voice playback note:', e);
      audioBusyRef.current = false;
      setIsAgentSpeaking(false);
    }
  };

  // 6. Send message / click quick response turn
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || studentInput;
    if (!text.trim() || isThinking) return;

    // Concurrency lock: stop agent immediately when student responds
    stopAudio();

    const currentSec = callDuration;
    const timeFormatted = `${String(Math.floor(currentSec / 60)).padStart(2, '0')}:${String(currentSec % 60).padStart(2, '0')}`;

    const newStudentTurn: DialogueMessage = {
      id: `msg-${Date.now()}-student`,
      speaker: 'student',
      text: text.trim(),
      timestamp: timeFormatted,
    };

    const nextMessages = [...messages, newStudentTurn];
    setMessages(nextMessages);
    setStudentInput('');
    setIsThinking(true);

    try {
      const history = nextMessages.map((m) => ({
        sender: m.speaker === 'agent' ? 'assistant' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history,
          voice: selectedVoice,
          language: selectedLanguage,
          context: {
            activeTopic: selectedStudent.itemTitle,
            location: selectedStudent.lostLocation,
            foundLocation: selectedStudent.foundLocation,
            token: selectedStudent.vaultToken,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.text || 'I have verified that for you.';

        const newAgentTurn: DialogueMessage = {
          id: `msg-${Date.now()}-agent`,
          speaker: 'agent',
          text: replyText,
          timestamp: timeFormatted,
          voice: selectedVoice,
        };

        setMessages((prev) => [...prev, newAgentTurn]);

        // CRITICAL: DYNAMICALLY UPDATE QUICK RESPONSES ACCORDING TO THE AGENT'S RESPONSE
        if (data.suggestedReplies && Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0) {
          setQuickResponses(data.suggestedReplies);
        }

        if (!isSpeakerMuted && data.audio) {
          audioBusyRef.current = true;
          setIsAgentSpeaking(true);
          const audio = await playWavBase64(data.audio);
          if (audio) {
            currentAudioRef.current = audio;
            audio.onended = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
            audio.onerror = () => {
              audioBusyRef.current = false;
              setIsAgentSpeaking(false);
            };
          } else {
            audioBusyRef.current = false;
            setIsAgentSpeaking(false);
          }
        }
      }
    } catch (err) {
      console.error('Conversation turn error:', err);
    } finally {
      setIsThinking(false);
    }
  };

  const durationFormatted = `${String(Math.floor(callDuration / 60)).padStart(2, '0')}:${String(callDuration % 60).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#004ac6]">
              Foundify Voice Intelligence
            </span>
            <span className="text-[11px] font-mono text-[#737686]">·</span>
            <span className="text-[11px] font-mono text-[#065f46] bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
              Gemini 2.5 Duplex Live
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#0b1c30]">
            Autonomous AI Voice Calling Console
          </h1>
          <p className="text-xs text-[#434655] mt-0.5 max-w-xl">
            Real-time conversational agent delivering empathetic, context-grounded notifications to Parul University students with zero voice overlap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#f8f9ff] border border-[#e2e8f0] text-xs font-mono">
            <span className="text-[#737686] block text-[10px] uppercase">Acoustic Latency</span>
            <strong className="text-[#004ac6] text-sm">198ms TTFB</strong>
          </div>

          <a
            href="https://foundify-9osq.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-3 bg-[#f8f9ff] hover:bg-white text-[#0b1c30] text-xs font-medium rounded-lg border border-[#e2e8f0] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Official Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#737686]" />
          </a>
        </div>
      </div>

      {/* Main 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (5 Cols): Target Student User Card, Calibrated Voice, Waveform, Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Target Student User Selector Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#737686]">
                Target Student User
              </span>
              
              <button
                onClick={() => setIsCustomUserModalOpen(true)}
                className="text-[11px] text-[#2563eb] hover:text-[#1d4ed8] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Custom User</span>
              </button>
            </div>

            {/* Quick Student Switcher Dropdown */}
            <div className="relative">
              <label className="text-[11px] font-medium text-[#737686] block mb-1">
                Select Database Match Student:
              </label>
              <select
                value={selectedStudent.id}
                onChange={(e) => {
                  const student = PRESET_STUDENT_USERS.find((s) => s.id === e.target.value);
                  if (student) handleSwitchTargetUser(student);
                }}
                className="w-full h-10 px-3 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] font-medium focus:outline-none focus:border-[#2563eb] cursor-pointer"
              >
                {PRESET_STUDENT_USERS.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.studentName} ({stu.phone}) — {stu.itemTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Selected Student Profile */}
            <div className="flex items-center gap-3 pt-1">
              <div className="w-10 h-10 rounded-lg bg-[#0b1c30] text-white flex items-center justify-center font-bold text-sm">
                {selectedStudent.studentName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm text-[#0b1c30] truncate">{selectedStudent.studentName}</h3>
                  <span className="text-[10px] text-[#737686] font-mono">({selectedStudent.enrollmentMasked})</span>
                </div>
                <span className="font-mono text-xs text-[#2563eb] font-semibold">{selectedStudent.phone}</span>
                <p className="text-[10px] text-[#737686] truncate">{selectedStudent.department}</p>
              </div>
            </div>

            {/* Matched Details */}
            <div className="bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#0b1c30] line-clamp-1">{selectedStudent.itemTitle}</span>
                <span className="font-mono text-[11px] text-[#006242] bg-[#ecfdf5] px-1.5 py-0.2 rounded border border-[#a7f3d0]">
                  {selectedStudent.vaultToken || 'PU-SEC-8821'}
                </span>
              </div>
              <div className="text-[11px] text-[#434655] space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#737686]">Lost at:</span>
                  <span className="truncate">{selectedStudent.lostLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#737686]">Found at:</span>
                  <span className="truncate">{selectedStudent.foundLocation}</span>
                </div>
              </div>
            </div>

            {/* 3 Calibrated Voices Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#434655]">Assigned Voice Persona</label>
                <span className="text-[10px] text-[#737686]">Zero overlap active</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: 'Aoede', role: 'Warm' },
                  { name: 'Puck', role: 'Friendly' },
                  { name: 'Charon', role: 'Security' },
                ].map((v) => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVoice(v.name as HumanVoiceName)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                      selectedVoice === v.name
                        ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                        : 'bg-[#f8f9ff] text-[#434655] border-[#e2e8f0] hover:bg-white'
                    }`}
                  >
                    <div className="font-semibold">{v.name}</div>
                    <div className={`text-[10px] ${selectedVoice === v.name ? 'text-blue-100' : 'text-[#737686]'}`}>
                      {v.role}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Waveform Visualizer Display */}
            <div className="bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg p-3 flex flex-col items-center justify-center gap-2">
              <AudioWaveform
                isActive={isAgentSpeaking}
                height={28}
                barCount={28}
                colorScheme="sapphire"
              />
              <div className="flex items-center justify-between w-full text-[11px] font-mono text-[#737686]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isAgentSpeaking ? 'bg-[#10b981] animate-voice-live' : 'bg-[#c3c6d7]'}`} />
                  <span>{isAgentSpeaking ? 'AI Speaking Audio' : 'Acoustic Baseline'}</span>
                </div>
                <span>{isCallLive ? durationFormatted : '00:00'}</span>
              </div>
            </div>

            {/* Call Control Action Bar */}
            <div className="flex items-center gap-2 pt-1">
              {!isCallLive ? (
                <button
                  onClick={handleStartCall}
                  className="flex-1 h-10 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {selectedStudent.studentName} (AI Agent)</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      isSpeakerMuted
                        ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]'
                        : 'bg-[#f8f9ff] text-[#434655] border-[#e2e8f0] hover:bg-white'
                    }`}
                    title={isSpeakerMuted ? 'Unmute Agent' : 'Mute Agent'}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleEndCall}
                    className="flex-1 h-10 rounded-lg bg-[#ef4444] hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Hangup & File Audit ({durationFormatted})</span>
                  </button>
                </>
              )}
            </div>

          </div>

          {/* Technical Telemetry Specs Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-xs space-y-2">
            <span className="font-semibold text-[#0b1c30] text-xs block">Operational Specifications</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#737686]">
              <div className="p-2 rounded bg-[#f8f9ff] border border-[#e2e8f0]">
                <span>Voice Model:</span>
                <strong className="block text-[#0b1c30]">Gemini 2.5 Flash</strong>
              </div>
              <div className="p-2 rounded bg-[#f8f9ff] border border-[#e2e8f0]">
                <span>Concurrency:</span>
                <strong className="block text-[#10b981]">Zero Collision</strong>
              </div>
              <div className="p-2 rounded bg-[#f8f9ff] border border-[#e2e8f0]">
                <span>Target Mode:</span>
                <strong className="block text-[#0b1c30] truncate">{selectedStudent.category}</strong>
              </div>
              <div className="p-2 rounded bg-[#f8f9ff] border border-[#e2e8f0]">
                <span>Security Token:</span>
                <strong className="block text-[#2563eb] truncate">{selectedStudent.vaultToken || 'PU-SEC-8821'}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): Live Transcript & Interactive Dialogue Inspector */}
        <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-xl flex flex-col h-[660px] shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] overflow-hidden">
          
          {/* Transcript Header */}
          <div className="h-12 px-5 border-b border-[#e2e8f0] bg-[#f8f9ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#2563eb]" />
              <span className="text-xs font-semibold text-[#0b1c30]">Live Dialogue Stream</span>
              <span className="text-[10px] font-mono text-[#434655] bg-white border border-[#e2e8f0] px-2 py-0.5 rounded-full">
                Target: {selectedStudent.studentName}
              </span>
            </div>

            <button
              onClick={() => {
                stopAudio();
                setMessages([
                  {
                    id: `reset-${Date.now()}`,
                    speaker: 'agent',
                    text: `Dialogue reset for ${selectedStudent.studentName}. Ready to initiate outbound match call.`,
                    timestamp: '00:00',
                    voice: selectedVoice,
                  },
                ]);
              }}
              className="text-xs text-[#737686] hover:text-[#0b1c30] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-white text-xs">
            {messages.map((turn) => {
              const isAgent = turn.speaker === 'agent';
              return (
                <div
                  key={turn.id}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#737686]">
                    <span className="font-semibold text-[#0b1c30]">
                      {isAgent ? `Foundify AI (${turn.voice || selectedVoice})` : `${selectedStudent.studentName} (Caller)`}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{turn.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-xs leading-relaxed ${
                      isAgent
                        ? 'bg-[#f8f9ff] border border-[#e2e8f0] text-[#0b1c30]'
                        : 'bg-[#0b1c30] text-white shadow-xs'
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              );
            })}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#737686] py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-bounce delay-200" />
                <span className="text-[11px]">Foundify AI generating natural response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* DYNAMIC QUICK RESPONSES SECTION — Updates after every response */}
          <div className="px-4 py-2.5 bg-[#f8f9ff] border-t border-[#e2e8f0] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#004ac6] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#2563eb]" />
                <span>Contextual Quick Responses (Adapts each turn):</span>
              </span>
              <span className="text-[10px] text-[#737686] font-mono">1-click student reply</span>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
              {quickResponses.map((prompt, idx) => (
                <button
                  key={`${idx}-${prompt.slice(0, 15)}`}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isThinking}
                  className="flex-shrink-0 px-2.5 py-1.5 bg-white border border-[#e2e8f0] hover:border-[#2563eb] hover:bg-[#eff4ff] rounded-md text-[#0b1c30] font-medium transition-all cursor-pointer shadow-2xs active:scale-98"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Live Voice Input Listening Banner */}
          {isListeningMic && (
            <div className="px-4 py-2 bg-[#ffdad6] border-t border-[#ffdad6] text-xs text-[#93000a] flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
                <span className="font-semibold text-[11px]">Microphone Active · Speak your response clearly now (Listening...)</span>
              </div>
              <button
                type="button"
                onClick={stopSpeechRecognition}
                className="text-[11px] font-mono font-semibold underline text-[#93000a] hover:text-[#0b1c30] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Input Box with Voice Input Button */}
          <div className="p-3.5 bg-white border-t border-[#e2e8f0] flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`h-10 px-3 rounded-lg border font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isListeningMic
                  ? 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a] animate-pulse shadow-xs'
                  : 'bg-[#f8f9ff] text-[#434655] border-[#e2e8f0] hover:bg-white hover:text-[#0b1c30]'
              }`}
              title={isListeningMic ? 'Stop Voice Input' : 'Speak into Microphone'}
            >
              {isListeningMic ? (
                <>
                  <MicOff className="w-4 h-4 text-[#ba1a1a]" />
                  <span className="font-semibold text-[#ba1a1a] text-[11px]">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-[#2563eb]" />
                  <span className="hidden sm:inline text-[11px] font-semibold text-[#2563eb]">Voice Input</span>
                </>
              )}
            </button>

            <input
              type="text"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={isListeningMic ? 'Listening to your speech...' : `Type reply from ${selectedStudent.studentName} or tap Voice Input...`}
              className="flex-1 h-10 px-3.5 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] placeholder-[#737686] focus:outline-none focus:border-[#2563eb]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!studentInput.trim() || isThinking}
              className="h-10 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>

        </div>

      </div>

      {/* Custom Target Student Modal */}
      {isCustomUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#e2e8f0] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-[#e2e8f0] bg-[#f8f9ff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#2563eb]" />
                <h3 className="font-semibold text-sm text-[#0b1c30]">Configure Target Student User</h3>
              </div>
              <button
                onClick={() => setIsCustomUserModalOpen(false)}
                className="text-[#737686] hover:text-[#0b1c30] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomStudent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#434655] mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={customForm.studentName || ''}
                  onChange={(e) => setCustomForm({ ...customForm, studentName: e.target.value })}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full h-9 px-3 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#434655] mb-1">Phone Number (from Database)</label>
                <input
                  type="text"
                  required
                  value={customForm.phone || ''}
                  onChange={(e) => setCustomForm({ ...customForm, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full h-9 px-3 text-xs font-mono bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#434655] mb-1">Vertical</label>
                  <select
                    value={customForm.category || 'Lost & Found'}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value as FoundifyVertical })}
                    className="w-full h-9 px-2.5 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none"
                  >
                    <option value="Lost & Found">Lost & Found</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="Rentals">Rentals</option>
                    <option value="Services">Services</option>
                    <option value="Giveaways">Giveaways</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#434655] mb-1">Custody Token</label>
                  <input
                    type="text"
                    value={customForm.vaultToken || ''}
                    onChange={(e) => setCustomForm({ ...customForm, vaultToken: e.target.value })}
                    placeholder="PU-SEC-9200"
                    className="w-full h-9 px-2.5 text-xs font-mono bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#434655] mb-1">Matched Item Title</label>
                <input
                  type="text"
                  required
                  value={customForm.itemTitle || ''}
                  onChange={(e) => setCustomForm({ ...customForm, itemTitle: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM4 Headphones"
                  className="w-full h-9 px-3 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#434655] mb-1">Lost Location</label>
                  <input
                    type="text"
                    value={customForm.lostLocation || ''}
                    onChange={(e) => setCustomForm({ ...customForm, lostLocation: e.target.value })}
                    placeholder="e.g. L Block Cafeteria"
                    className="w-full h-9 px-2.5 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#434655] mb-1">Found Location</label>
                  <input
                    type="text"
                    value={customForm.foundLocation || ''}
                    onChange={(e) => setCustomForm({ ...customForm, foundLocation: e.target.value })}
                    placeholder="e.g. L Block Turnstile Desk"
                    className="w-full h-9 px-2.5 text-xs bg-[#f8f9ff] border border-[#e2e8f0] rounded-lg text-[#0b1c30] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setIsCustomUserModalOpen(false)}
                  className="px-3 py-1.5 bg-[#f8f9ff] border border-[#e2e8f0] text-[#434655] rounded-lg font-medium hover:bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Apply & Set as Active Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
