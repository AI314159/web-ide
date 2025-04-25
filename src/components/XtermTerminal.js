import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "../app/public/xterm.css";

export default function XtermTerminal({ wsUrl, visible = true }) {
  const xtermRef = useRef();
  const termRef = useRef();
  const fitAddonRef = useRef();
  const wsRef = useRef();

  // Helper to send resize event to backend
  const sendResize = () => {
    if (termRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const { rows, cols } = termRef.current;
      wsRef.current.send(JSON.stringify({ type: "resize", rows, cols }));
    }
  };

  useEffect(() => {
    if (!xtermRef.current) return;

    termRef.current = new Terminal({
      convertEol: true, 
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14
    });
    fitAddonRef.current = new FitAddon();
    termRef.current.loadAddon(fitAddonRef.current);


    termRef.current.open(xtermRef.current);
    fitAddonRef.current.fit();


    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      termRef.current.write(event.data);
    };

    termRef.current.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }));
      }
    });

    ws.onopen = () => {
      fitAddonRef.current.fit();
      sendResize();
    };

    const ro = new window.ResizeObserver(() => {
      fitAddonRef.current.fit();
      sendResize();
    });
    ro.observe(xtermRef.current);

    return () => {
      termRef.current.dispose();
      ws.close();
      ro.disconnect();
    };
    // eslint-disable-next-line
  }, [wsUrl, xtermRef.current]);

  useEffect(() => {
    if (visible && fitAddonRef.current) {
      setTimeout(() => {
        fitAddonRef.current.fit();
        sendResize();
      }, 100);
    }
    // eslint-disable-next-line
  }, [visible]);

  return (
    <div
      ref={xtermRef}
      className={`w-full h-full bg-gray-900 ${visible ? "block" : "hidden"}`}
    />
  );
}
