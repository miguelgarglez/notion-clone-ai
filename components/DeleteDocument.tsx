'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRoom } from '@liveblocks/react/suspense';
import { useRouter } from 'next/navigation';
import { deleteDocument } from '@/actions/actions';
import { toast } from 'sonner';

function DeleteDocument() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const room = useRoom();
  const router = useRouter();

  const handleDeleteDocument = async () => {
    const roomId = room.id;
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await deleteDocument(roomId);

      if (success) {
        setIsOpen(false);
        router.replace('/');
        toast.success('Document deleted successfully');
      } else {
        toast.error('Failed to delete document');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="destructive">
        <DialogTrigger>Delete</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to Delete?</DialogTitle>
          <DialogDescription>
            This will delete the document and all its contents, removing all
            users from the document
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteDocument}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDocument;
