'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import * as Y from 'yjs';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { BotIcon, LanguagesIcon } from 'lucide-react';
import Markdown from 'react-markdown';

type Language =
  | 'spanish'
  | 'french'
  | 'german'
  | 'chinese'
  | 'japanese'
  | 'korean'
  | 'arabic'
  | 'russian'
  | 'portuguese'
  | 'italian';

const languages: Language[] = [
  'spanish',
  'french',
  'german',
  'chinese',
  'japanese',
  'korean',
  'arabic',
  'russian',
  'portuguese',
  'italian',
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleAskTranslation = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const documentData = doc.get('document-store').toJSON();

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/translate-document`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              documentData: documentData,
              targetLanguage: language,
            }),
          }
        );
        if (res.ok) {
          const { translated_text } = await res.json();

          setSummary(translated_text);
          toast.success('Document translated successfully');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Failed to translate document');
        return;
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <LanguagesIcon className="mr-1" />
          Translate
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate content</DialogTitle>
          <DialogDescription>
            Choose the language you want to translate to:
          </DialogDescription>
        </DialogHeader>

        {/* { render the summary of the document in the desired language } */}
        {summary && (
          <div className="flex">
            <div>
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? 'is thinking...' : 'Says:'}
              </p>
            </div>
            <p>{isPending ? 'Thinking...' : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskTranslation}>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? 'Translating...' : 'Translate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TranslateDocument;
