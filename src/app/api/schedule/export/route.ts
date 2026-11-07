import { NextResponse } from 'next/server';
import { scheduleData } from '../route';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionIdsParam = searchParams.get('ids');
    const selectedIds = sessionIdsParam ? sessionIdsParam.split(',') : null;

    let allSessions = scheduleData.days.flatMap((d) =>
      d.sessions.map((s) => ({
        ...s,
        date: d.date
      }))
    );

    if (selectedIds && selectedIds.length > 0) {
      allSessions = allSessions.filter((s) => selectedIds.includes(s.id));
    }

    const formatIcsDate = (dateStr: string, timeStr: string) => {
      // dateStr: YYYY-MM-DD, timeStr: HH:mm
      const cleanDate = dateStr.replace(/-/g, '');
      const cleanTime = timeStr.replace(/:/g, '') + '00';
      return `${cleanDate}T${cleanTime}`;
    };

    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Detroit Digital Artist Convention//DDACC Agenda 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:DDACC 2026 Schedule',
      'X-WR-TIMEZONE:America/Detroit'
    ];

    for (const s of allSessions) {
      const dtStart = formatIcsDate(s.date, s.startTime);
      const dtEnd = formatIcsDate(s.date, s.endTime);
      const summary = s.title.replace(/[,;]/g, ' ');
      const desc = (s.description || '').replace(/\n/g, ' ').replace(/[,;]/g, ' ');
      const loc = `${s.location}, Huntington Place, Detroit, MI`;

      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`UID:ddacc-2026-${s.id}@detroitdigitalartist.org`);
      icsLines.push(`DTSTAMP:${formatIcsDate('2026-05-15', '00:00')}Z`);
      icsLines.push(`DTSTART:${dtStart}`);
      icsLines.push(`DTEND:${dtEnd}`);
      icsLines.push(`SUMMARY:${summary}`);
      icsLines.push(`DESCRIPTION:${desc}`);
      icsLines.push(`LOCATION:${loc}`);
      icsLines.push(`CATEGORIES:${s.track}`);
      icsLines.push('STATUS:CONFIRMED');
      icsLines.push('END:VEVENT');
    }

    icsLines.push('END:VCALENDAR');
    const icsContent = icsLines.join('\r\n');

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="ddacc-2026-agenda.ics"'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
