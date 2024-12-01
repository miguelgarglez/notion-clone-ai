'use client';

import { useRoom } from '@liveblocks/react/suspense';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { Button } from './ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import TranslateDocument from './TranslateDocument';
import BlockNote from './BlockNote';
import ChatToDocument from './ChatToDocument';

function CollabEditor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  const style = `hover:text-white ${
    darkMode
      ? 'text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700'
      : 'text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700'
  }`;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* {TranslateDocument} */}
        <TranslateDocument doc={doc} />

        {/* {ChatToDocument} */}
        <ChatToDocument doc={doc} />

        {/* {Dark Mode} */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
      {/* {Block Note} */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode}></BlockNote>
    </div>
  );
}

export default CollabEditor;
