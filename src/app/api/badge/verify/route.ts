import { NextResponse } from 'next/server';
import { memoryBadges, verifyBadgeSignature, createBadgePass } from '@/lib/badge';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { BadgePass, BadgeRole } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const passId = searchParams.get('passId');

  if (!passId) {
    return NextResponse.json(
      { status: 'error', message: 'Missing passId query parameter.' },
      { status: 400 }
    );
  }

  const pass = memoryBadges.get(passId);
  if (!pass) {
    return NextResponse.json(
      { status: 'error', message: 'Badge pass not found in registration registry.' },
      { status: 404 }
    );
  }

  const isValid = verifyBadgeSignature(pass);

  return NextResponse.json({
    status: 'success',
    valid: isValid,
    badge: pass
  });
}

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit('badge-verify', clientId, {
      windowMs: 60 * 1000,
      maxRequests: 30
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { status: 'error', message: 'Check-in request rate limit exceeded.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, passId, attendeeName, role, tier, affiliation } = body;

    // Action 1: Register/Issue new badge pass
    if (action === 'issue') {
      if (!attendeeName) {
        return NextResponse.json(
          { status: 'error', message: 'attendeeName is required to issue a badge.' },
          { status: 400 }
        );
      }

      const newPass = createBadgePass(
        attendeeName,
        (role as BadgeRole) || 'Community Attendee',
        tier || 'Weekend Pass',
        affiliation
      );

      memoryBadges.set(newPass.passId, newPass);

      return NextResponse.json(
        {
          status: 'success',
          message: 'Digital badge pass generated and signed successfully.',
          badge: newPass
        },
        { status: 201 }
      );
    }

    // Action 2: Check-in pass at door
    if (action === 'checkin') {
      if (!passId) {
        return NextResponse.json(
          { status: 'error', message: 'passId is required for check-in.' },
          { status: 400 }
        );
      }

      const pass = memoryBadges.get(passId);
      if (!pass) {
        return NextResponse.json(
          { status: 'error', message: 'Badge pass not found.' },
          { status: 404 }
        );
      }

      if (!verifyBadgeSignature(pass)) {
        return NextResponse.json(
          { status: 'error', message: 'Cryptographic signature mismatch! Badge invalid.' },
          { status: 403 }
        );
      }

      const updatedPass: BadgePass = {
        ...pass,
        checkedIn: true,
        checkInTimestamp: new Date().toISOString()
      };
      memoryBadges.set(passId, updatedPass);

      return NextResponse.json({
        status: 'success',
        message: `Welcome to DDACC 2026, ${pass.attendeeName}! Badge successfully verified and checked in.`,
        badge: updatedPass
      });
    }

    return NextResponse.json(
      { status: 'error', message: 'Invalid action. Supported actions: issue, checkin.' },
      { status: 400 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return NextResponse.json(
      { status: 'error', message: `Invalid check-in payload: ${message}` },
      { status: 400 }
    );
  }
}
