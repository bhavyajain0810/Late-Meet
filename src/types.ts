// Shared TypeScript Interfaces for Late Meet

export interface Topic {
  name: string;
  status: "active" | "completed" | "unresolved";
  duration?: string;
  startTime?: string;
}

export interface TranscriptEntry {
  speaker: string;
  text: string;
  timestamp: number;
}

export interface TimelineEvent {
  event: string;
  timestamp: number;
  elapsed: number;
}

export interface Decision {
  text: string;
  by?: string;
  timestamp?: string;
  classification?: "tentative" | "finalized";
}

export interface ActionItem {
  task: string;
  owner?: string;
  deadline?: string;
  confidence?: "high" | "medium" | "low";
  isSpeculative?: boolean;
}

export interface KeyInsight {
  text: string;
  confidenceScore: number;
}

export interface Contradiction {
  issue: string;
  persists: boolean;
}

export interface State {
  id?: string;
  savedAt?: string | number;
  isActive: boolean;
  meetingId: string | null;
  meetingUrl: string | null;
  startTime: number | null;
  summary: string;
  topics: Topic[];
  decisions: Decision[];
  actionItems: ActionItem[];
  currentTopic: string;
  sentiment: string;
  keyInsights: KeyInsight[];
  unresolvedDiscussions: string[];
  contradictions: Contradiction[];
  questionsRaised: string[];
  participants: string[];
  initialParticipants: string[];
  lateJoiners: string[];
  timeline: TimelineEvent[];
  transcript: TranscriptEntry[];
  audioActive: boolean;
  currentSpeaker?: string | null;
  targetTabId?: number | null;
  lastSummarizedAt?: number;
  participantCount?: number;
}

export interface MeetingStorageInfo {
  id: string;
  title: string;
  date: string;
  totalBytes: number;
  transcriptBytes: number;
  summaryBytes: number;
  actionItemBytes: number;
}

export interface StorageStats {
  totalBytes: number;
  quotaBytes: number;
  percentUsed: number;
  transcriptBytes: number;
  summaryBytes: number;
  actionItemBytes: number;
  settingsBytes: number;
  meetingCount: number;
  largestMeetings: MeetingStorageInfo[];
  warningThreshold: number;
}


// ============================================================
// Storage Types — for type-safe chrome.storage operations
// ============================================================

/** A single meeting session stored by the extension */
export interface MeetingSession {
  id: string;
  tabId: number;
  meetingUrl: string;
  meetingTitle: string;
  startTime: number;        // Unix timestamp (ms)
  endTime: number | null;   // null if recording is still active
  durationMs: number | null;
  participants: string[];
  transcript: TranscriptEntry[];
  summary: string | null;
  language: string;         // BCP 47 language tag (e.g., "en-US")
  schemaVersion: number;    // For migration support
}

/** A single transcript entry with speaker and timestamp */
export interface TranscriptEntry {
  speaker: string;
  text: string;
  timestamp: number;        // Offset from meeting start in ms
  confidence: number;       // 0.0 to 1.0
}

/** Root schema for chrome.storage.local */
export interface StorageSchema {
  apiKey: string | null;
  encryptedApiKey: string | null;
  sessions: MeetingSession[];
  preferences: ExtensionPreferences;
  schemaVersion: number;
}

/** User preferences for the extension */
export interface ExtensionPreferences {
  autoStart: boolean;
  language: string;
  showTranscriptInMeeting: boolean;
  summaryStyle: 'brief' | 'detailed' | 'bullets';
  theme: 'light' | 'dark' | 'system';
}
