// app/api/files/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/authentication';
import { processFile } from '@/lib/file-utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getUserDataDir } from '@/lib/file-utils';

export async function PUT(req: NextRequest) {
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

  // Ensure upload directories exist
  await mkdir(path.join(userDataDir, 'thumbnails'), { recursive: true });

  // Extract filename from headers
  const contentDisposition = req.headers.get('content-disposition');
  let filename = 'unknown.tmp';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  try {
    const buffer = await req.arrayBuffer();
    const filePath = path.join(userDataDir, filename);

    await writeFile(filePath, Buffer.from(buffer));

    const supported = await processFile(userDataDir, filename);

    if (supported) {
      return NextResponse.json({
        status: 'success',
        data: `${filename} uploaded successfully`,
      });
    } else {
      return NextResponse.json({ status: 'error', message: 'Unsupported file type' }, { status: 405 });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ status: 'error', message: 'Upload error' }, { status: 500 });
  }
}
