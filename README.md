
# Web IDE

Welcome! This is a web powered IDE kind of like Replit, written in 
JavaScript and TypeScript with Next.js. It uses Monaco Editor, the same as VS Code, and it has server-based compilation and input streaming through Node-pty on the backend, and Xterm.js on the frontend. It currently supports only Rust, but it would be very easy to add more languages due to the way the backend is written.

To run, start but running `npm i` to install the dependencies. set up your `.env` and your `.env.local` files. Note that the database URL should be a PostgreSQL database. Then, make sure the database is synced with the Prisma schema. Then, run these two commands in seperate windows:
```
npm run ws # To start the websocket server for code compilation
npm run dev # To start the Next.js server
```
...And that's all!

_If you find this project cool, leaving a star would be greatly appreciated!_