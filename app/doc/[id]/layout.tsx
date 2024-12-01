import { auth } from '@clerk/nextjs/server';
import RoomProvider from '@/components/RoomProvider';
import React from 'react';

type DocLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

async function DocLayout({ children, params }: DocLayoutProps) {
  auth.protect();

  const { id } = await params;

  return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocLayout;
