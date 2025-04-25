"use client";
import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

export default function MonacoEditor({ code, setCode, containerRef }) {
  const editorRef = useRef();

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // Watch for container resize and call layout
  useEffect(() => {
    if (!containerRef?.current) return;
    if (!editorRef.current) return;

    const ro = new window.ResizeObserver(() => {
      editorRef.current.layout();
    });
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, [containerRef, editorRef.current]);

  return (
    <Editor
      height="100%"
      defaultLanguage="rust"
      value={code}
      onChange={(value) => setCode(value)}
      theme="vs-dark"
      fontFamily="'JetBrains Mono', monospace"
      options={{
        fontSize: 16,
        minimap: { enabled: false },
      }}
      onMount={handleEditorDidMount}
    />
  );
}
