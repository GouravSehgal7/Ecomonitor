// app/api/cron1/route.ts
import { NextResponse } from 'next/server';
import handler from '@/lib/cronhelper1';

export async function GET() {
  try {
    // await handler();
    return NextResponse.json({ message: 'Cron job ran successfully.' });
  } catch (error: any) {
    console.error('❌ Cron job error:', error?.message);
    return NextResponse.json({ error: 'Cron job failed.', message: error?.message }, { status: 500 });
  }
}
