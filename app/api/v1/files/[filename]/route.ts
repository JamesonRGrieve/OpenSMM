// app/api/files/download/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/authentication';
import { readFile } from 'fs/promises';
import path from 'path';
import { getUserDataDir } from '@/lib/file-utils';

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  // Extract authentication token from headers or URL
  const token = req.headers.get('authorization')?.split(' ')[1] || req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ status: 'error', message: 'Authentication required' }, { status: 401 });
  }

  const user = await authenticateToken(token);
  if (!user) {
    return NextResponse.json({ status: 'error', message: 'Invalid token' }, { status: 403 });
  }

  const userDataDir = getUserDataDir(user._id);
  const filePath = path.join(userDataDir, params.filename);

  try {
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        'Content-Disposition': `attachment; filename="${params.filename}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ status: 'error', message: 'File not found' }, { status: 404 });
  }
}
