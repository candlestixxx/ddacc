export interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  track: TrackType;
  location: string;
  description: string;
  speakers?: string[];
  capacity?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface DaySchedule {
  dayId: 'day-1' | 'day-2' | 'day-3';
  date: string;
  theme: string;
  sessions: Session[];
}

export interface Schedule {
  eventName: string;
  days: DaySchedule[];
}

export type TrackType =
  | 'Love Collective'
  | 'Industry & Innovation'
  | 'Emergent Tools & Workshops'
  | 'Interactive & Experimental Media'
  | 'General';

export type ApplicationType =
  | 'Artist Alley Table'
  | 'Speaker / Panel Proposal'
  | 'Interactive Installation'
  | 'Workshop Lead';

export type ArtMedium =
  | '2D Digital Illustration'
  | '3D Modeling & Sculpting'
  | 'Concept Art & Visual Development'
  | 'Motion Graphics & Animation'
  | 'VFX & Real-Time Engine'
  | 'AR / VR / XR'
  | 'Generative & Algorithmic'
  | 'Other';

export interface ArtistApplication {
  fullName: string;
  email: string;
  artistHandle?: string;
  portfolioUrl: string;
  formType: ApplicationType;
  primaryMedium: ArtMedium;
  proposalDetails: string;
  technicalRequirements?: string;
  pledgeAgreed: boolean;
}

export interface WallNote {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  category: 'General' | 'Art Tip' | 'Collaboration' | 'Shoutout';
}

export type BadgeRole = 'Creator / Exhibitor' | 'Speaker' | 'VIP Pass' | 'Community Attendee' | 'Staff / Volunteer';

export interface BadgePass {
  passId: string;
  attendeeName: string;
  role: BadgeRole;
  affiliation?: string;
  tier: 'All-Access' | 'Weekend Pass' | 'Day Pass' | 'Exhibitor Booth';
  verificationHash: string;
  issuedAt: string;
  checkedIn: boolean;
  checkInTimestamp?: string;
}

export interface VenueZone {
  id: string;
  name: string;
  code: string;
  level: 1 | 2;
  capacity: number;
  currentOccupancy: number;
  highlightTrack?: TrackType;
  description: string;
  features: string[];
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface VenueFloor {
  level: 1 | 2;
  name: string;
  subtitle: string;
  zones: VenueZone[];
}
