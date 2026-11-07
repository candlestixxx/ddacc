import { WallNote } from '@/types';

export type WallEventType = 'new_note' | 'note_liked' | 'ping';

export interface WallEvent {
  type: WallEventType;
  data: WallNote | { id: string; likes: number } | { timestamp: string };
}

type Listener = (event: WallEvent) => void;

class WallEventEmitter {
  private listeners: Set<Listener> = new Set();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: WallEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error invoking wall event listener:', err);
      }
    });
  }

  public getSubscriberCount(): number {
    return this.listeners.size;
  }
}

// Global persistent instance across Next.js API route modules
const globalForEvents = globalThis as unknown as {
  wallEventEmitter?: WallEventEmitter;
};

export const wallEventEmitter = globalForEvents.wallEventEmitter || new WallEventEmitter();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.wallEventEmitter = wallEventEmitter;
}
