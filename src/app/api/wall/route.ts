import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rateLimit';
import { wallEventEmitter } from '@/lib/wallEvents';

export interface WallNote {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  likes: number;
  category: 'General' | 'Art Tip' | 'Collaboration' | 'Shoutout';
}

const memoryWallNotes: WallNote[] = [
  {
    id: 'note-1',
    author: 'DetroitPixel',
    message: 'Can’t wait to show the 3D projection mapping demo at DDACC 2026! Detroit artists rise up! 🎨',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    likes: 18,
    category: 'Shoutout'
  },
  {
    id: 'note-2',
    author: 'ShaderQueen',
    message: 'Quick geometry nodes tip: Use attribute blur on curves before mesh deformation for silky smooth organic extrusions.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    likes: 24,
    category: 'Art Tip'
  },
  {
    id: 'note-3',
    author: 'MotorCityVR',
    message: 'Looking for a sound designer to collaborate on our immersive warehouse soundscape room. DM if interested!',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    likes: 9,
    category: 'Collaboration'
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let notes = memoryWallNotes;
  if (category && category !== 'All') {
    notes = notes.filter((n) => n.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    status: 'success',
    total: notes.length,
    notes
  });
}

export async function POST(request: Request) {
  try {
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit('digital-wall', clientId, {
      windowMs: 60 * 1000,
      maxRequests: 15
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Rate limit exceeded. Please wait a moment before sending more wall updates.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, id, author, message, category } = body;

    if (action === 'like') {
      const note = memoryWallNotes.find((n) => n.id === id);
      if (!note) {
        return NextResponse.json({ status: 'error', message: 'Note not found' }, { status: 404 });
      }
      note.likes += 1;
      // Broadcast like update to all SSE connected streams
      wallEventEmitter.emit({
        type: 'note_liked',
        data: { id: note.id, likes: note.likes }
      });
      return NextResponse.json({ status: 'success', note });
    }

    if (!author || !message) {
      return NextResponse.json({ status: 'error', message: 'Author and message are required.' }, { status: 400 });
    }

    if (message.length > 280) {
      return NextResponse.json({ status: 'error', message: 'Note must be 280 characters or less.' }, { status: 400 });
    }

    const newNote: WallNote = {
      id: `note-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      category: category || 'General'
    };

    memoryWallNotes.unshift(newNote);

    // Broadcast new note to all SSE connected streams
    wallEventEmitter.emit({
      type: 'new_note',
      data: newNote
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Note added to the DDACC collaborative canvas.',
        note: newNote
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 400 });
  }
}
