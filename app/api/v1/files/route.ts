// app/api/files/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/authentication';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';
import { getUserDataDir } from '@/lib/file-utils';

export async function GET(req: NextRequest) {
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

  try {
    // Ensure the directory exists before trying to read it
    await mkdir(userDataDir, { recursive: true });

    const files = await readdir(userDataDir);
    const filteredFiles = files.filter((file) => file !== 'thumbnails');

    return NextResponse.json({
      status: 'success',
      data: filteredFiles,
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ status: 'error', message: 'Server error' }, { status: 500 });
  }
}
