"use client"
import React from "react";
import dynamic from 'next/dynamic';
const XtermTerminal = dynamic(() => import("./XtermTerminal"), {
  ssr: false,
});

export default function TerminalContainer({ sessionId, terminalVisible, setTerminalVisible }) {
    // This component has the rendering logic for the terminal

    return (
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
    )
}