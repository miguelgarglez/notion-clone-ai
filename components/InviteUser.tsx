'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { FormEvent, useState, useTransition } from 'react';
import { useRoom } from '@liveblocks/react/suspense';
import { toast } from 'sonner';
import { inviteUserToDocument } from '@/actions/actions';
import { Input } from './ui/input';

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const room = useRoom();

  const handleInviteUser = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = room.id;
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail('');
        toast.success('User added to document successfully');
      } else {
        toast.error('Failed to add user to document');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate.</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2" onSubmit={handleInviteUser}>
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? 'Inviting...' : 'Invite'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;
