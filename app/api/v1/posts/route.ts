import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { PostSchema } from '@/lib/validation';
import { schedulePost, unschedulePost } from '@/lib/schedule';

const prisma = new PrismaClient();

// POST /api/posts - Create a new post
export async function POST(req: NextRequest) {
  try {
    // TODO: Implement authentication
    // const user = await authenticateRequest(req);

    const body = await req.json();
    const validation = PostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          status: 'error',
          message: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { accounts, text, attachment, datetime } = validation.data;

    const post = await prisma.post.create({
      data: {
        text,
        datetime,
        attachments: attachment ? JSON.stringify(attachment) : undefined,
        accountPosts: {
          create: accounts.map((accountId) => ({
            accountId,
            status: 'pending',
          })),
        },
      },
    });

    // Schedule the post
    await schedulePost(post.id, datetime);

    return NextResponse.json({
      status: 'success',
      message: 'Post scheduled successfully',
      data: post,
    });
  } catch (error) {
    console.error('Post creation error:', error);
    return NextResponse.json({ status: 'error', message: 'Could not schedule post' }, { status: 500 });
  }
}

// DELETE /api/posts - Delete a post
export async function DELETE(req: NextRequest) {
  try {
    // TODO: Implement authentication
    // const user = await authenticateRequest(req);

    const { postId } = await req.json();

    // Unschedule the post first
    await unschedulePost(postId);

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Post has been deleted',
    });
  } catch (error) {
    console.error('Post deletion error:', error);
    return NextResponse.json({ status: 'error', message: 'Post could not be deleted' }, { status: 500 });
  }
}

// GET /api/posts - List posts
export async function GET(req: NextRequest) {
  try {
    // TODO: Implement authentication
    // const user = await authenticateRequest(req);

    const posts = await prisma.post.findMany({
      include: {
        accountPosts: {
          include: {
            account: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: 'success',
      data: posts,
    });
  } catch (error) {
    console.error('Posts retrieval error:', error);
    return NextResponse.json({ status: 'error', message: 'Error getting posts from database' }, { status: 500 });
  }
}
