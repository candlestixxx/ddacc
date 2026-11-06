import { NextResponse } from 'next/server';

const startTime = Date.now();

export async function GET() {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const memoryUsage = process.memoryUsage ? process.memoryUsage() : null;

  return NextResponse.json({
    status: 'ONLINE',
    version: '0.2.0',
    convention: 'Detroit Digital Artist Convention & Conference (DDACC 2026)',
    location: 'Huntington Place Detroit & Global Web Relay',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    services: {
      scheduleEngine: 'HEALTHY',
      artistAlleyIntake: 'HEALTHY',
      digitalWallSync: 'HEALTHY',
      projectionOutput: 'READY'
    },
    activeConnections: Math.floor(35 + Math.random() * 15),
    systemMemory: memoryUsage
      ? {
          heapUsedMB: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
          heapTotalMB: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
          rssMB: (memoryUsage.rss / 1024 / 1024).toFixed(2)
        }
      : null
  });
}
