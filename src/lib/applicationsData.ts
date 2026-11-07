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
    status: 'approved'
  }
];
