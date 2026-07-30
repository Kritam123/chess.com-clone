import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { WebSocket, WebSocketServer } from "ws";

import { createRoomManager } from "./server/roomManager.js";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const manager = createRoomManager();
const socketTokens = new Map();
const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
};

const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const filePath = path.resolve(ROOT, `.${decodeURIComponent(pathname)}`);

    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
        response.writeHead(403).end("Forbidden");
        return;
    }

    response.setHeader("Content-Type", contentTypes[path.extname(filePath)]
        ?? "application/octet-stream");
    response.setHeader("Cache-Control", "no-store");
    const stream = fs.createReadStream(filePath);
    stream.on("error", () => response.writeHead(404).end("Not found"));
    stream.pipe(response);
});

const websocketServer = new WebSocketServer({ server, path: "/ws" });

function send(socket, payload) {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
}

function broadcastRoom(room) {
    for (const color of ["white", "black"]) {
        const player = room.players[color];
        if (!player) continue;
        for (const [socket, token] of socketTokens) {
            if (token === player.token) {
                send(socket, { type: "state", state: manager.snapshot(room, token) });
            }
        }
    }
}

function attachPlayer(socket, room, player) {
    for (const [existingSocket, token] of socketTokens) {
        if (token === player.token && existingSocket !== socket) {
            socketTokens.delete(existingSocket);
            existingSocket.close(1000, "Reconnected in another tab");
        }
    }
    socketTokens.set(socket, player.token);
    send(socket, {
        type: "session",
        roomId: room.id,
        token: player.token,
        color: player.color,
    });
    broadcastRoom(room);
}

websocketServer.on("connection", (socket) => {
    send(socket, { type: "connected" });

    socket.on("message", (rawMessage) => {
        try {
            const message = JSON.parse(rawMessage.toString());
            const token = socketTokens.get(socket);
            let room;

            if (message.type === "create_room") {
                const result = manager.createRoom(message);
                attachPlayer(socket, result.room, result.player);
                return;
            }
            if (message.type === "join_room") {
                const result = manager.joinRoom(message);
                attachPlayer(socket, result.room, result.player);
                return;
            }
            if (message.type === "reconnect") {
                const result = manager.reconnect(message);
                attachPlayer(socket, result.room, result.player);
                return;
            }
            if (!token) throw new Error("Join a room before sending game actions.");

            const action = { ...message, token };
            if (message.type === "move") room = manager.makeMove(action);
            else if (message.type === "resign") room = manager.resign(action);
            else if (message.type === "rematch") room = manager.requestRematch(action);
            else if (message.type === "chat") room = manager.addChat(action);
            else throw new Error("Unknown action.");
            broadcastRoom(room);
        } catch (error) {
            send(socket, { type: "error", message: error.message });
        }
    });

    socket.on("close", () => {
        const token = socketTokens.get(socket);
        socketTokens.delete(socket);
        if (!token) return;
        if ([...socketTokens.values()].includes(token)) return;
        const room = manager.disconnect(token);
        if (room) broadcastRoom(room);
    });
});

server.listen(PORT, () => {
    console.log(`Chess room server running at http://localhost:${PORT}`);
});

export { server };
