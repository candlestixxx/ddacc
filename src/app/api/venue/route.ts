import { NextResponse } from 'next/server';
import { VenueFloor } from '@/types';

export const venueFloorsData: VenueFloor[] = [
  {
    level: 1,
    name: 'Level 1: Exhibition Hall & Main Arena',
    subtitle: 'Ground concourse with main stage, artist alleys, and interactive projection domes',
    zones: [
      {
        id: 'main-stage',
        name: 'Main Stage (Hall A)',
        code: 'L1-STAGE-A',
        level: 1,
        capacity: 1200,
        currentOccupancy: 850,
        highlightTrack: 'General',
        description: 'Keynotes, speed-sculpt battles, and opening ceremony presentations.',
        features: ['4K Dual Projectors', 'Spatial Detroit Audio', 'Live Stream Feed'],
        coordinates: { x: 50, y: 50, width: 340, height: 180 }
      },
      {
        id: 'artist-alley',
        name: 'Artist Alley Amphitheater',
        code: 'L1-ALLEY-B',
        level: 1,
        capacity: 500,
        currentOccupancy: 420,
        highlightTrack: 'Love Collective',
        description: '42 independent juried artist tables, physical merch booths, and print racks.',
        features: ['Power Drop per Table', 'Pass Turnstiles', 'Direct Freight Loading'],
        coordinates: { x: 420, y: 50, width: 340, height: 180 }
      },
      {
        id: 'projection-dome',
        name: 'Projection Dome & XR Pavilion',
        code: 'L1-XR-DOME',
        level: 1,
        capacity: 200,
        currentOccupancy: 165,
        highlightTrack: 'Interactive & Experimental Media',
        description: '360-degree dome projection synchronized with live GLSL audio-reactive visual shaders.',
        features: ['Omnidirectional Sound', 'XR Headset Stations', 'Blackout Baffles'],
        coordinates: { x: 50, y: 260, width: 340, height: 180 }
      },
      {
        id: 'networking-concourse',
        name: 'Detroit Riverview Concourse',
        code: 'L1-CONCOURSE',
        level: 1,
        capacity: 800,
        currentOccupancy: 310,
        highlightTrack: 'General',
        description: 'Registration turnstiles, badge claims, coffee lounges, and digital wall projection relays.',
        features: ['Riverwalk Windows', 'Badge Verification Turnstiles', 'Digital Wall Sync Node'],
        coordinates: { x: 420, y: 260, width: 340, height: 180 }
      }
    ]
  },
  {
    level: 2,
    name: 'Level 2: Innovation Ballrooms & Hands-on Labs',
    subtitle: 'Upper concourse dedicated to technical workshops, hands-on labs, and studio incubators',
    zones: [
      {
        id: 'innovation-ballroom',
        name: 'Innovation Ballroom',
        code: 'L2-BALLROOM-C',
        level: 2,
        capacity: 450,
        currentOccupancy: 280,
        highlightTrack: 'Industry & Innovation',
        description: 'Automotive visualization pipelines, USD open standards, and studio career panels.',
        features: ['Dual Tier Lectern', 'Acoustic Wall Paneling', 'Q&A Mic Rigs'],
        coordinates: { x: 50, y: 50, width: 340, height: 180 }
      },
      {
        id: 'lab-geometry-nodes',
        name: 'Lab 1: Geometry Nodes & Blender',
        code: 'L2-LAB-01',
        level: 2,
        capacity: 80,
        currentOccupancy: 74,
        highlightTrack: 'Emergent Tools & Workshops',
        description: 'High-performance workstations configured with Blender, Godot, and Linux dev roots.',
        features: ['Dedicated GPU Rigs', 'Dual Monitor Setups', 'Local Node Cache'],
        coordinates: { x: 420, y: 50, width: 340, height: 180 }
      },
      {
        id: 'lab-vfx-unreal',
        name: 'Lab 2: Unreal Engine 5.5 VFX',
        code: 'L2-LAB-02',
        level: 2,
        capacity: 90,
        currentOccupancy: 82,
        highlightTrack: 'Emergent Tools & Workshops',
        description: 'Hands-on Niagara particles, shader authoring, and virtual production volume control.',
        features: ['RTX 4090 Workstations', 'Direct LED Wall Relay', 'Motion Capture Rig'],
        coordinates: { x: 50, y: 260, width: 340, height: 180 }
      },
      {
        id: 'hackerspace-lounge',
        name: 'The Love Collective Hackerspace',
        code: 'L2-HACKER-L',
        level: 2,
        capacity: 150,
        currentOccupancy: 110,
        highlightTrack: 'Love Collective',
        description: 'Collaborative code sprint tables, synth jam stations, and open critique circles.',
        features: ['Modular Workbenches', 'Soldering Stations', 'MIDI Sequencer Racks'],
        coordinates: { x: 420, y: 260, width: 340, height: 180 }
      }
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const levelParam = searchParams.get('level');

  let floors = venueFloorsData;
  if (levelParam) {
    const levelNumber = parseInt(levelParam, 10);
    if (levelNumber === 1 || levelNumber === 2) {
      floors = venueFloorsData.filter((f) => f.level === levelNumber);
    }
  }

  const totalCapacity = venueFloorsData.reduce(
    (acc, f) => acc + f.zones.reduce((zAcc, z) => zAcc + z.capacity, 0),
    0
  );
  const totalOccupancy = venueFloorsData.reduce(
    (acc, f) => acc + f.zones.reduce((zAcc, z) => zAcc + z.currentOccupancy, 0),
    0
  );

  return NextResponse.json({
    status: 'success',
    venue: 'Huntington Place Detroit',
    address: '1 Washington Blvd, Detroit, MI 48226',
    totalCapacity,
    totalOccupancy,
    occupancyRate: Math.round((totalOccupancy / totalCapacity) * 100),
    floors
  });
}
