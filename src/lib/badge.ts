import { BadgePass, BadgeRole } from '@/types';

const BADGE_SECRET = 'ddacc-detroit-2026-auth-salt';

/**
 * Deterministic hash generator for badge pass verification
 */
export function generateBadgeHash(passId: string, attendeeName: string, role: BadgeRole): string {
  const payload = `${passId}:${attendeeName}:${role}:${BADGE_SECRET}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Creates a signed badge pass object
 */
export function createBadgePass(
  attendeeName: string,
  role: BadgeRole = 'Community Attendee',
  tier: BadgePass['tier'] = 'Weekend Pass',
  affiliation?: string
): BadgePass {
  const cleanName = attendeeName.trim() || 'Detroit Creator';
  const prefix = role.includes('Exhibitor') ? 'EXH' : role.includes('Speaker') ? 'SPK' : role.includes('VIP') ? 'VIP' : 'ATT';
  const passId = `DDACC26-${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  const verificationHash = generateBadgeHash(passId, cleanName, role);

  return {
    passId,
    attendeeName: cleanName,
    role,
    affiliation: affiliation?.trim() || undefined,
    tier,
    verificationHash,
    issuedAt: new Date().toISOString(),
    checkedIn: false
  };
}

/**
 * Validates a badge pass against its cryptographic checksum
 */
export function verifyBadgeSignature(pass: BadgePass): boolean {
  const expectedHash = generateBadgeHash(pass.passId, pass.attendeeName, pass.role);
  return pass.verificationHash === expectedHash;
}

/**
 * In-memory badge registry simulating the check-in database
 */
export const memoryBadges: Map<string, BadgePass> = new Map([
  [
    'DDACC26-VIP-FOUNDER-001',
    {
      passId: 'DDACC26-VIP-FOUNDER-001',
      attendeeName: 'Robert Pelloni',
      role: 'VIP Pass',
      affiliation: 'DDACC Organizing Committee',
      tier: 'All-Access',
      verificationHash: generateBadgeHash('DDACC26-VIP-FOUNDER-001', 'Robert Pelloni', 'VIP Pass'),
      issuedAt: '2026-03-01T00:00:00.000Z',
      checkedIn: true,
      checkInTimestamp: '2026-05-15T08:30:00.000Z'
    }
  ],
  [
    'DDACC26-EXH-ARTIST-002',
    {
      passId: 'DDACC26-EXH-ARTIST-002',
      attendeeName: 'Jada Carter',
      role: 'Creator / Exhibitor',
      affiliation: 'Detroit Art Collective',
      tier: 'Exhibitor Booth',
      verificationHash: generateBadgeHash('DDACC26-EXH-ARTIST-002', 'Jada Carter', 'Creator / Exhibitor'),
      issuedAt: '2026-03-10T12:00:00.000Z',
      checkedIn: false
    }
  ]
]);
