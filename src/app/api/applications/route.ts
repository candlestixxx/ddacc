import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

import { memoryApplications, ApplicationRecord } from '@/lib/applicationsData';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    total: memoryApplications.length,
    applications: memoryApplications
  });
}

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit('applications', clientId, {
      windowMs: 60 * 1000,
      maxRequests: 5
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rate limit exceeded. Please wait a minute before submitting again.'
        },
        { status: 429 }
      );
    }

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
