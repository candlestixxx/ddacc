import { wallEventEmitter, WallEvent } from '@/lib/wallEvents';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const initialPayload = JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString()
      });
      controller.enqueue(encoder.encode(`event: connected\ndata: ${initialPayload}\n\n`));

      // Subscribe to global emitter
      const unsubscribe = wallEventEmitter.subscribe((event: WallEvent) => {
        try {
          const payload = JSON.stringify(event.data);
          controller.enqueue(encoder.encode(`event: ${event.type}\ndata: ${payload}\n\n`));
        } catch (err) {
          console.error('Failed to encode SSE event:', err);
        }
      });

      // Heartbeat ping every 15s to keep connection alive through proxies
      const interval = setInterval(() => {
        try {
          const pingPayload = JSON.stringify({ timestamp: new Date().toISOString() });
          controller.enqueue(encoder.encode(`event: ping\ndata: ${pingPayload}\n\n`));
        } catch {
          clearInterval(interval);
          unsubscribe();
        }
      }, 15000);

      // Clean up when request aborts/disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}
