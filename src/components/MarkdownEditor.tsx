import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ content, onChange }) => {
  return (
    <div className="markdown-editor" data-color-mode="light">
      <MDEditor
        value={content}
        onChange={(val) => onChange(val || '')}
        height={500}
        preview="live"
        previewOptions={{
          rehypePlugins: [[rehypeSanitize]],
        }}
        textareaProps={{
          placeholder: 'Write your content here using Markdown...',
        }}
      />
    </div>
  );
};

export default MarkdownEditor; 