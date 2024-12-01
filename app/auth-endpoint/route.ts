import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import liveblocks from '@/lib/liveblocks';
import { adminDb } from '@/firebase-admin';

export async function POST(req: NextRequest) {
  auth.protect();

  const { sessionClaims } = await auth();

  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims!.email, {
    userInfo: {
      email: sessionClaims!.email,
      name: sessionClaims!.fullName,
      avatar: sessionClaims!.image,
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup('rooms')
    .where('userId', '==', sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);

    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json({ error: 'User not in room' }, { status: 403 });
  }
}
