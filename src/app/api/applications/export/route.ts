import { NextResponse } from 'next/server';

import { memoryApplications, ApplicationRecord } from '@/lib/applicationsData';

export async function GET() {
  try {
    const apps = memoryApplications;

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Artist Handle',
      'Form Type',
      'Primary Medium',
      'Portfolio URL',
      'Status',
      'Created At'
    ];

    const escapeCsv = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;

    const csvRows = apps.map((app: ApplicationRecord) => [
      escapeCsv(app.id),
      escapeCsv(app.fullName),
      escapeCsv(app.email),
      escapeCsv(app.artistHandle || ''),
      escapeCsv(app.formType),
      escapeCsv(app.primaryMedium),
      escapeCsv(app.portfolioUrl),
      escapeCsv(app.status),
      escapeCsv(app.createdAt)
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="ddacc-2026-applications.csv"'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}
