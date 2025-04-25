"use client";
import React, { useRef, useState } from "react";
import { FaPlay, FaTerminal } from "react-icons/fa";
import MonacoEditor from "../../components/MonacoEditor";
import dynamic from 'next/dynamic';

const XtermTerminal = dynamic(() => import("../../components/XtermTerminal"), {
  ssr: false, // This disables server-side rendering for the import
});
export default function IDEPage() {
  const [code, setCode] = useState(`fn main() {
    println!("Hello, world!");
}`);
  const [sessionId, setSessionId] = useState(null);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(300);
  const monacoContainerRef = useRef();

  const handleRun = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/run-c", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const { sessionId } = await res.json();
    setSessionId(sessionId);
    setTerminalVisible(true);
  };


  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
      <div className="flex space-x-2">
        <button
          onClick={handleRun}
          className="hover:text-green-400"
        >
          <FaPlay />
        </button>
        {sessionId && !terminalVisible && (
          <button
            onClick={() => setTerminalVisible(true)}
            className="hover:text-blue-400"
          >
            <FaTerminal />
          </button>
        )}
      </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          ref={monacoContainerRef}
          className={`${
            terminalVisible ? "h-[calc(100%-300px)]" : "h-full"
          } transition-height`}
        >
          <MonacoEditor code={code} setCode={setCode} containerRef={monacoContainerRef} />
        </div>
        {sessionId && (
          <>
            <div
              className={`${
                terminalVisible ? "h-1 cursor-row-resize bg-gray-700" : "h-0"
              } transition-height`}
            />
            <div
              className={`${
                terminalVisible ? "block" : "hidden"
              } h-[300px] min-h-[100px] bg-gray-900 relative`}
            >
              <button
                onClick={() => setTerminalVisible(false)}
                className="absolute top-2 right-2 z-20 bg-gray-700 text-white rounded px-2 py-1 hover:bg-gray-600"
                title="Hide Terminal"
              >
                ✕
              </button>
              <XtermTerminal wsUrl={`ws://localhost:3001/?sessionId=${sessionId}`} visible={terminalVisible} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
