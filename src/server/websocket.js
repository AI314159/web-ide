const WebSocket = require("ws");
const { spawn } = require("child_process");
const pty = require("node-pty");
const fs = require("fs");
const path = require("path");

const wss = new WebSocket.Server({ port: 3001 });

// Make it easy to change languages in the future
const compiler = "rustc";
const filename = "main.rs";
const outputFilename = "main";

wss.on("connection", function connection(ws, req) {
  console.log("New WebSocket connection");
  const url = new URL(req.url, "http://localhost:3001");
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    ws.close();
    return;
  }

  const codeDir = path.join("/tmp/ide_code", sessionId);
  const codeFile = path.join(codeDir, filename);
  const outputFile = path.join(codeDir, outputFilename);

  console.log("Compiling code");

  // We just use spawn normally here because we don't need to be interactive for compilation
  const compilerProcess = spawn("rustc", [codeFile, "-o", outputFile]);
  let compileError = "";

  compilerProcess.stderr.on("data", (data) => {
    compileError += data.toString();
  });

  compilerProcess.on("close", (code) => {
    console.log("Compiler exited with code", code);
    if (code !== 0) {
      ws.send(`${compileError}\n[Compilation failed: Compiler exited with code ${code}]\n`);
      // ws.close();
      // return;
    }

    try {
      fs.chmodSync(outputFile, 0o755);
    } catch (e) {
      ws.send("Failed to set executable permissions.\n");
      // ws.close();
      // return;
    }

    // I added a delay here because it was erroring with ETXTBSY
    setTimeout(() => {
      let cols = 80;
      let rows = 30;

      // Spawn the PTY process
      console.log("Spawning PTY process...");
      const ptyProcess = pty.spawn(outputFile, [], {
        name: "xterm-color",
        cols,
        rows,
        cwd: codeDir,
        env: process.env,
      });
      console.log("PTY process spawned");

      ptyProcess.on("data", (data) => {
        ws.send(data);
      });

      ws.on("message", (msg) => {
        console.log("Received message from client:", msg);
        try {
          const parsed = JSON.parse(msg);
          if (parsed.type === "input") {
            ptyProcess.write(parsed.data);
          } else if (parsed.type === "resize" && parsed.cols && parsed.rows) {
            cols = parsed.cols;
            rows = parsed.rows;
            console.log(`Resizing PTY to ${cols}x${rows}`);
            ptyProcess.resize(cols, rows);
          }
        } catch (e) {
          console.log("Malformed request.");
        }
      });

      ptyProcess.on("exit", (code) => {
        ws.send(`\r\n[Process exited with code ${code}]\r\n`);
        // ws.close();
      });

      ws.on("close", () => {
        ptyProcess.kill();
      });
    }, 100);
  });
});

console.log("WebSocket server running on ws://localhost:3001");
