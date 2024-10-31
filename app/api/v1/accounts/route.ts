import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/accounts - List user's accounts
export async function GET(req: NextRequest) {
  try {
    // TODO: Implement authentication
    // const user = await authenticateRequest(req);

    const accounts = await prisma.account.findMany({
      where: {
        // userId: user.id,
        NOT: {
          AND: [{ platform: 'facebook' }, { type: 'user' }],
        },
      },
      select: {
        id: true,
        platform: true,
        type: true,
        name: true,
        picture: true,
      },
    });

    return NextResponse.json({
      status: 'success',
      data: accounts.map((account) => ({
        _id: account.id,
        platform: account.platform,
        type: account.type,
        userEmail: account.name,
        picture: account.picture,
      })),
    });
  } catch (error) {
    console.error('Accounts retrieval error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to read accounts' }, { status: 500 });
  }
}
