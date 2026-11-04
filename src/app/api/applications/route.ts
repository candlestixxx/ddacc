import { NextResponse } from 'next/server';

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

const memoryApplications: ApplicationRecord[] = [
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

export async function GET() {
  return NextResponse.json({
    status: 'success',
    total: memoryApplications.length,
    applications: memoryApplications
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, portfolioUrl, formType, primaryMedium, proposalDetails, pledgeAgreed } = body;

    if (!fullName || !email || !portfolioUrl || !formType || !proposalDetails) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required application fields.' },
        { status: 400 }
      );
    }

    if (!pledgeAgreed) {
      return NextResponse.json(
        { status: 'error', message: 'You must agree to the Love Collective Pledge to apply.' },
        { status: 400 }
      );
    }

    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      fullName,
      email,
      artistHandle: body.artistHandle || '',
      portfolioUrl,
      formType,
      primaryMedium: primaryMedium || '2D Digital Illustration',
      proposalDetails,
      technicalRequirements: body.technicalRequirements || '',
      pledgeAgreed: Boolean(pledgeAgreed),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    memoryApplications.unshift(newRecord);

    return NextResponse.json(
      {
        status: 'success',
        message: 'Application received successfully. Welcome to the Love Collective review process.',
        record: newRecord
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return NextResponse.json(
      { status: 'error', message: `Invalid request payload: ${message}` },
      { status: 400 }
    );
  }
}
