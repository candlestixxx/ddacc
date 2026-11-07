export interface ApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  artistHandle?: string;
  portfolioUrl: string;
  formType: 'Artist Alley Table' | 'Speaker / Panel Proposal' | 'Interactive Installation' | 'Workshop Lead';
  primaryMedium: string;
  proposalDetails: string;
  technicalRequirements?: string;
  pledgeAgreed: boolean;
  createdAt: string;
  status: 'pending' | 'approved' | 'waitlist' | 'rejected';
  votes: number;
  votedIps: string[];
}

export const memoryApplications: ApplicationRecord[] = [
  {
    id: 'app-seed-1',
    fullName: 'Jada Carter',
    email: 'jada@detroitart.xyz',
    artistHandle: '@jadadraws',
    portfolioUrl: 'https://jada.artstation.com',
    formType: 'Artist Alley Table',
    primaryMedium: '2D Digital Illustration',
    proposalDetails: 'Afrofuturist prints and holographic stickers celebrating Detroit motor city heritage.',
    technicalRequirements: 'Standard 6ft table with 120V power for iPad display.',
    pledgeAgreed: true,
    createdAt: new Date().toISOString(),
    status: 'approved',
    votes: 42,
    votedIps: []
  },
  {
    id: 'app-seed-2',
    fullName: 'Marcus Vance',
    email: 'marcus@3dforge.io',
    artistHandle: '@vance_voxels',
    portfolioUrl: 'https://artstation.com/vance_voxels',
    formType: 'Interactive Installation',
    primaryMedium: 'VFX & Real-Time Engine',
    proposalDetails: 'Real-time procedural cyberpunk Detroit skyline reacting to ambient convention floor synthesizer audio.',
    technicalRequirements: 'RTX 4090 rig, 4K projector, ultra-low latency line-in.',
    pledgeAgreed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'approved',
    votes: 35,
    votedIps: []
  },
  {
    id: 'app-seed-3',
    fullName: 'Kendra O’Connor',
    email: 'kendra@shaderlab.net',
    artistHandle: '@kendra_nodes',
    portfolioUrl: 'https://kendraoconnor.com',
    formType: 'Workshop Lead',
    primaryMedium: '3D Modeling & Sculpting',
    proposalDetails: 'Hands-on Geometry Nodes masterclass: Creating generative industrial lattices and techno architecture.',
    technicalRequirements: 'Dual monitors, student projector feed.',
    pledgeAgreed: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'approved',
    votes: 28,
    votedIps: []
  }
];
