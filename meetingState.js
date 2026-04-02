// Meeting State Manager — Shared state module for Meeting Copilot

const MeetingState = {
  // Meeting metadata
  isActive: false,
  meetingId: null,
  meetingUrl: null,
  startTime: null,
  duration: 0,
  
  // Transcription
  transcript: [],
  rawTranscriptBuffer: '',
  lastProcessedIndex: 0,
  
  // AI Intelligence
  summary: '',
  topics: [],
  decisions: [],
  actionItems: [],
  currentTopic: '',
  sentiment: 'neutral',
  keyInsights: [],
  questionsRaised: [],
  
  // Participants
  participants: [],
  initialParticipants: [],
  lateJoiners: [],
  speakerStats: [],
  
  // Timeline
  timeline: [],
  
  // Role
  isHost: false,

  /**
   * Reset state for a new meeting
   */
  reset() {
    this.isActive = false;
    this.meetingId = null;
    this.meetingUrl = null;
    this.startTime = null;
    this.duration = 0;
    this.transcript = [];
    this.rawTranscriptBuffer = '';
    this.lastProcessedIndex = 0;
    this.summary = '';
    this.topics = [];
    this.decisions = [];
    this.actionItems = [];
    this.currentTopic = '';
    this.sentiment = 'neutral';
    this.keyInsights = [];
    this.questionsRaised = [];
    this.participants = [];
    this.initialParticipants = [];
    this.lateJoiners = [];
    this.speakerStats = [];
    this.timeline = [];
    this.isHost = false;
  },

  /**
   * Start a new meeting session
   */
  startMeeting(meetingId, url) {
    this.reset();
    this.isActive = true;
    this.meetingId = meetingId;
    this.meetingUrl = url;
    this.startTime = Date.now();
  },

  /**
   * Add transcript entry
   */
  addTranscript(speaker, text, timestamp) {
    this.transcript.push({ speaker, text, timestamp: timestamp || Date.now() });
    this.rawTranscriptBuffer += `${speaker}: ${text}\n`;
  },

  /**
   * Update AI intelligence from processed results
   */
  updateIntelligence(result) {
    if (result.summary) this.summary = result.summary;
    if (result.topics) this.topics = result.topics;
    if (result.decisions) this.decisions = result.decisions;
    if (result.actionItems) this.actionItems = result.actionItems;
    if (result.currentTopic) this.currentTopic = result.currentTopic;
    if (result.sentiment) this.sentiment = result.sentiment;
    if (result.keyInsights) this.keyInsights = result.keyInsights;
    if (result.questionsRaised) this.questionsRaised = result.questionsRaised;
  },

  /**
   * Detect new participants (late joiners)
   */
  updateParticipants(currentList) {
    const newJoiners = currentList.filter(
      p => !this.participants.includes(p) && !this.initialParticipants.includes(p)
    );

    if (this.participants.length === 0 && this.initialParticipants.length === 0) {
      // First scan — these are the initial participants
      this.initialParticipants = [...currentList];
      this.participants = [...currentList];
      return [];
    }

    if (newJoiners.length > 0) {
      this.lateJoiners.push(...newJoiners);
      this.participants = [...currentList];
    }

    return newJoiners;
  },

  /**
   * Add timeline entry
   */
  addTimelineEntry(event, timestamp) {
    this.timeline.push({
      event,
      timestamp: timestamp || Date.now(),
      elapsed: this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0
    });
  },

  /**
   * Get current meeting duration in seconds
   */
  getDuration() {
    if (!this.startTime) return 0;
    return Math.round((Date.now() - this.startTime) / 1000);
  },

  /**
   * Get a snapshot of the current state for messaging
   */
  getSnapshot() {
    return {
      isActive: this.isActive,
      meetingId: this.meetingId,
      startTime: this.startTime,
      duration: this.getDuration(),
      summary: this.summary,
      topics: this.topics,
      decisions: this.decisions,
      actionItems: this.actionItems,
      currentTopic: this.currentTopic,
      sentiment: this.sentiment,
      keyInsights: this.keyInsights,
      questionsRaised: this.questionsRaised,
      participants: this.participants,
      lateJoiners: this.lateJoiners,
      speakerStats: this.speakerStats,
      timeline: this.timeline,
      transcriptCount: this.transcript.length
    };
  },

  /**
   * Get brief context for late joiner
   */
  getLateJoinerContext() {
    return {
      summary: this.summary,
      topics: this.topics,
      decisions: this.decisions,
      actionItems: this.actionItems,
      currentTopic: this.currentTopic,
      duration: this.getDuration(),
      participantCount: this.participants.length
    };
  }
};

// Make available globally for content script (non-module context)
if (typeof window !== 'undefined') {
  window.MeetingState = MeetingState;
}
