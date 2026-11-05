export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

const clientStores = new Map<string, Map<string, ClientRecord>>();

export function checkRateLimit(
  namespace: string,
  identifier: string,
  options: RateLimiterOptions = { windowMs: 60 * 1000, maxRequests: 20 }
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();

  if (!clientStores.has(namespace)) {
    clientStores.set(namespace, new Map<string, ClientRecord>());
  }

  const store = clientStores.get(namespace)!;
  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    const newRecord: ClientRecord = {
      count: 1,
      resetTime: now + options.windowMs
    };
    store.set(identifier, newRecord);
    return {
      allowed: true,
      remaining: options.maxRequests - 1,
      resetTime: newRecord.resetTime
    };
  }

  if (record.count >= options.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: options.maxRequests - record.count,
    resetTime: record.resetTime
  };
}

export function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'default-client';
}
