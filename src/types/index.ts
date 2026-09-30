export type TrackType =
  | 'Love Collective'
  | 'Industry & Innovation'
  | 'Emergent Tools & Workshops'
  | 'Interactive & Experimental Media'
  | 'General';

export interface Speaker {
  name: string;
  role?: string;
  organization?: string;
  bio?: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  track: TrackType;
  location: string;
  speakers?: Speaker[];
}

export interface Day {
  dayId: 'day-1' | 'day-2' | 'day-3';
  date: string;
  theme: string;
  sessions: Session[];
}

export interface Schedule {
  eventName: string;
  days: Day[];
}

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

export interface ArtistProfile {
  fullName: string;
  artistHandle?: string;
  email: string;
  location?: string;
  portfolioUrl: string;
  socialLinks?: string[];
}

export interface ProposalDetails {
  title?: string;
  abstract: string;
  collectiveAffiliation?: string;
  techRequirements?: string[];
}

export interface ArtistApplication {
  applicantId: string;
  submissionDate: string;
  artistProfile: ArtistProfile;
  applicationType: ApplicationType;
  artMediums: ArtMedium[];
  proposalDetails: ProposalDetails;
  loveCollectivePledge: boolean;
}