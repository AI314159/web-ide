import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

export async function POST(request) {
  const { code } = await request.json();
  // This id is used so we can talk to the pty session through websockets
  const sessionId = uuidv4();
  const codeDir = path.join("/tmp/ide_code", sessionId);
  fs.mkdirSync(codeDir, { recursive: true });

  const codeFile = path.join(codeDir, "main.rs");
  fs.writeFileSync(codeFile, code);

  return Response.json({ sessionId });
}
