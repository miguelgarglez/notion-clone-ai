import { BlockNoteView } from '@blocknote/shadcn';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteEditor } from '@blocknote/core';
import * as Y from 'yjs';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { useSelf } from '@liveblocks/react/suspense';
import stringToColor from '@/lib/stringToColor';

type CollabEditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: CollabEditorProps) {
  const userInfo = useSelf((me) => me.info);

  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment('document-store'),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>
  );
}

export default BlockNote;
