"use client";
import React, { useRef, useEffect, useState } from "react";
import { FaPlay, FaTerminal, FaSave } from "react-icons/fa";
import MonacoEditor from "../../../components/MonacoEditor";
import dynamic from 'next/dynamic';
import { useParams } from "next/navigation";
import TerminalContainer from "@/components/TerminalContainer";

// const XtermTerminal = dynamic(() => import("../../../components/XtermTerminal"), {
//   ssr: false,
// });


export default function IDEPage() {
  const params = useParams();
  const id = params.id;
  const [code, setCode] = useState("");
  
  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then((res) => res.json())
        .then((project) => setCode(project.code));
    }
  }, [id]);

  const [sessionId, setSessionId] = useState(null);
  const [terminalVisible, setTerminalVisible] = useState(false);

  // TODO: Make the terminal resizable
  const [terminalHeight, setTerminalHeight] = useState(300);
  const editorContainerRef = useRef();

  const handleRun = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/run-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const { sessionId } = await res.json();
    setSessionId(sessionId);
    setTerminalVisible(true);
  };

  const handleSave = async () => {
    await fetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, code }),
    });
    console.log("Code saved!");
  };

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
      <div className="flex space-x-2">
        <button
          onClick={handleRun}
          className="hover:text-green-300"
        >
          <FaPlay />
        </button>
        <button onClick={handleSave} className="hover:text-blue-300"><FaSave /></button>
        {sessionId && !terminalVisible && (
          <button
            onClick={() => setTerminalVisible(true)}
            className="hover:text-blue-300"
          >
            <FaTerminal />
          </button>
        )}
      </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          ref={editorContainerRef}
          className={`${
            terminalVisible ? "h-[calc(100%-300px)]" : "h-full"
          } transition-height`}
        >
          <MonacoEditor code={code} setCode={setCode} containerRef={editorContainerRef} />
        </div>
        {sessionId && (
          <TerminalContainer sessionId={sessionId} terminalVisible={terminalVisible} setTerminalVisible={setTerminalVisible} />
        )}
      </div>
    </div>
  );
}
