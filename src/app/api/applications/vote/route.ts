import { NextResponse } from 'next/server';
import { memoryApplications } from '@/lib/applicationsData';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit('applications-vote', clientId, {
      windowMs: 60 * 1000,
      maxRequests: 20
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Voting rate limit exceeded. Please wait a moment before voting again.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'Application ID is required.' },
        { status: 400 }
      );
    }

    const app = memoryApplications.find((a) => a.id === id);
    if (!app) {
      return NextResponse.json(
        { status: 'error', message: 'Application not found.' },
        { status: 404 }
      );
    }

    // Check if client has already voted for this application
    if (!app.votedIps) {
      app.votedIps = [];
    }

    if (app.votedIps.includes(clientId)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'You have already voted for this proposal.',
          votes: app.votes
        },
        { status: 409 }
      );
    }

    app.votes = (app.votes || 0) + 1;
    app.votedIps.push(clientId);

    return NextResponse.json({
      status: 'success',
      message: 'Vote cast successfully.',
      id: app.id,
      votes: app.votes
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 400 });
  }
}
