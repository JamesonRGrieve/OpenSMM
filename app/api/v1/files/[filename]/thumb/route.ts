// app/api/files/thumbnail/[filename]/[index]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/authentication';
import { readFile } from 'fs/promises';
import path from 'path';
import { getUserDataDir } from '@/lib/file-utils';

export async function GET(req: NextRequest, { params }: { params: { filename: string; index: string } }) {
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
  const thumbnailPath = path.join(userDataDir, 'thumbnails', `${params.filename}${params.index}.webp`);

  try {
    const thumbnail = await readFile(thumbnailPath);

    return new NextResponse(thumbnail, {
      headers: {
        'Content-Type': 'image/webp',
      },
    });
  } catch (error) {
    console.error('Thumbnail error:', error);
    return NextResponse.json({ status: 'error', message: 'Thumbnail not found' }, { status: 404 });
  }
}
