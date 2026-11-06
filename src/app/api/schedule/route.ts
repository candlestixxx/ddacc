import { NextResponse } from 'next/server';

export interface Session {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  track: string;
  location: string;
  description: string;
  speakers?: string[];
  capacity?: number;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface DaySchedule {
  dayId: string;
  date: string;
  theme: string;
  sessions: Session[];
}

export const scheduleData: { days: DaySchedule[] } = {
  days: [
    {
      dayId: 'day-1',
      date: '2026-05-15',
      theme: 'Welcome to the Collective & Industry Fundamentals',
      sessions: [
        {
          id: 's1',
          title: 'Opening Keynote: Detroit Digital Renaissance',
          startTime: '09:00',
          endTime: '10:30',
          track: 'General',
          location: 'Main Stage (Hall A)',
          description: 'Setting the Vision for Detroit’s Digital Future & The Love Collective Ethos with local founders and digital artists.',
          speakers: ['Aria Vance', 'Marcus Chen'],
          capacity: 1200,
          level: 'All Levels'
        },
        {
          id: 's2',
          title: 'The Modern Digital Pipeline: Concept to Engine',
          startTime: '10:45',
          endTime: '12:15',
          track: 'Industry & Innovation',
          location: 'Innovation Ballroom',
          description: 'Integrating open-source tooling, USD assets, and real-time visualization in automotive and game design.',
          speakers: ['Devon Sterling', 'Elena Rostova'],
          capacity: 450,
          level: 'Intermediate'
        },
        {
          id: 's3',
          title: 'Blender Essentials: Lighting & Geometry Nodes',
          startTime: '10:45',
          endTime: '12:15',
          track: 'Emergent Tools & Workshops',
          location: 'Lab 1',
          description: 'Hands-on practical workshop constructing procedural Detroit architecture with geometry nodes.',
          speakers: ['Samira Khan'],
          capacity: 80,
          level: 'Beginner'
        },
        {
          id: 's4',
          title: 'Spatial Audio & Techno Visual Synthesis',
          startTime: '13:30',
          endTime: '15:00',
          track: 'Interactive & Experimental Media',
          location: 'Black Box Studio',
          description: 'Connecting Detroit techno step-sequencers directly to generative GLSL shaders and TouchDesigner pipelines.',
          speakers: ['Derrick Mayers', 'K-Tone'],
          capacity: 250,
          level: 'All Levels'
        }
      ]
    },
    {
      dayId: 'day-2',
      date: '2026-05-16',
      theme: 'Deep Dives, Emerging Tech & High-Energy Showcase',
      sessions: [
        {
          id: 's5',
          title: 'Creative Rights, Open Weights & Ethical AI',
          startTime: '10:00',
          endTime: '11:30',
          track: 'Industry & Innovation',
          location: 'Main Stage (Hall A)',
          description: 'Balancing automation, digital ownership, copyright protections, and ethical model curation for independent illustrators.',
          speakers: ['Nia Williams, Esq.', 'Dr. Julian Thorne'],
          capacity: 1000,
          level: 'All Levels'
        },
        {
          id: 's6',
          title: 'Mastering Real-Time VFX in Unreal 5.5',
          startTime: '11:45',
          endTime: '13:15',
          track: 'Emergent Tools & Workshops',
          location: 'Lab 2',
          description: 'Niagara particle systems, fluid simulations, and high-frequency shader authoring for next-gen interactive stages.',
          speakers: ['Lucas Vance'],
          capacity: 90,
          level: 'Advanced'
        },
        {
          id: 's7',
          title: 'Artist Alley Live Battles: 20-Minute Speed Sculpt',
          startTime: '14:00',
          endTime: '15:30',
          track: 'Love Collective',
          location: 'Artist Alley Amphitheater',
          description: 'Live head-to-head 3D sculpting duel using ZBrush and Blender. Audience chooses theme on the fly.',
          speakers: ['Maya Lin', 'Carlos Ruiz'],
          capacity: 500,
          level: 'All Levels'
        }
      ]
    },
    {
      dayId: 'day-3',
      date: '2026-05-17',
      theme: 'Impact, Future & Cross-Discipline Collaboration',
      sessions: [
        {
          id: 's8',
          title: 'Independent Artist Grants & Local Funding Ecosystems',
          startTime: '10:30',
          endTime: '12:00',
          track: 'Love Collective',
          location: 'Room B',
          description: 'Navigating Michigan cultural grants, Patreon co-ops, micro-patronage, and sustainable full-time creative practice.',
          speakers: ['Tasha Robinson', 'Kenji Sato'],
          capacity: 300,
          level: 'All Levels'
        },
        {
          id: 's9',
          title: 'Interactive XR Installation Showcase & Tour',
          startTime: '13:00',
          endTime: '14:30',
          track: 'Interactive & Experimental Media',
          location: 'Exhibition Hall C',
          description: 'Curated walkthrough of 12 site-specific physical-digital installations installed at Huntington Place.',
          speakers: ['Curatorial Collective'],
          capacity: 200,
          level: 'All Levels'
        },
        {
          id: 's10',
          title: 'Closing Ceremony & Community Mural Unveiling',
          startTime: '16:00',
          endTime: '17:30',
          track: 'General',
          location: 'Main Stage (Hall A)',
          description: 'Final celebration, awards for community contributions, and continuous projection playback of the DDACC Digital Wall.',
          speakers: ['DDACC Organizers & The Love Collective'],
          capacity: 1500,
          level: 'All Levels'
        }
      ]
    }
  ]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');
  const track = searchParams.get('track');
  const query = searchParams.get('q')?.toLowerCase();

  let days = scheduleData.days;

  if (day) {
    days = days.filter((d) => d.dayId === day);
  }

  const result = days.map((d) => {
    let sessions = d.sessions;
    if (track && track !== 'All') {
      sessions = sessions.filter((s) => s.track.toLowerCase() === track.toLowerCase());
    }
    if (query) {
      sessions = sessions.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.location.toLowerCase().includes(query) ||
          (s.speakers && s.speakers.some((sp) => sp.toLowerCase().includes(query)))
      );
    }
    return {
      ...d,
      sessions
    };
  });

  return NextResponse.json({
    status: 'success',
    totalDays: result.length,
    days: result
  });
}
