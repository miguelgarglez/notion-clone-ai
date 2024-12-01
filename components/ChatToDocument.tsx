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
import { toast } from 'sonner';
import { Input } from './ui/input';
import * as Y from 'yjs';
import { BotIcon, MessageCircleCode } from 'lucide-react';
import Markdown from 'react-markdown';

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState('');
  const [summary, setSummary] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get('document-store').toJSON();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chat-to-document`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              documentData: documentData,
              question: input,
            }),
          }
        );

        if (res.ok) {
          const message = await res.json();

          setInput('');
          setSummary(message);
          toast.success('Question handled successfully');
        }
      } catch (error) {
        // !
        console.log(`Error: ${error}`);

        toast.error('Failed to answer your question');
        return;
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-1" />
          Chat To Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with AI</DialogTitle>
          <DialogDescription>
            Talk with AI about the document, ask questions about it, query data
            from it,...
          </DialogDescription>
          <hr className="mt-5" />

          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {/* { render the answer for the question } */}
        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? 'is thinking...' : 'Says:'}
              </p>
            </div>
            <p>{isPending ? 'Thinking...' : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="i.e. What is this about?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? 'Thinking...' : 'Ask'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ChatToDocument;
