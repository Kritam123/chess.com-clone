import crypto from "node:crypto";

import { createInitialBoard } from "../Helper/boardFactory.js";
import { getGameStatus, isLegalMove, pieceKind } from "../Helper/gameRules.js";

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PROMOTIONS = new Set(["queen", "rook", "bishop", "knight"]);

function cleanName(value) {
    const name = String(value ?? "").trim().replace(/\s+/g, " ");
    return name.slice(0, 24) || "Guest";
}

function createRoomId(existingRooms) {
    for (let attempt = 0; attempt < 100; attempt++) {
        let id = "";
        for (let index = 0; index < 6; index++) {
            id += ROOM_ALPHABET[crypto.randomInt(ROOM_ALPHABET.length)];
        }
        if (!existingRooms.has(id)) return id;
    }
    throw new Error("Could not create a unique room code.");
}

function chooseCreatorColor(preference) {
    if (preference === "black") return "black";
    if (preference === "random") {
        return crypto.randomInt(2) === 0 ? "white" : "black";
    }
    return "white";
}

function otherColor(color) {
    return color === "white" ? "black" : "white";
}

function createPlayer(name, color) {
    return {
        token: crypto.randomUUID(),
        name: cleanName(name),
        color,
        connected: true,
    };
}

function publicPlayer(player) {
    return player ? {
        name: player.name,
        color: player.color,
        connected: player.connected,
    } : null;
}

function notationForMove(piece, from, to, captured, promotion, status) {
    const kind = pieceKind(piece);
    const prefix = kind === "pawn" ? (captured ? from[0] : "") : {
        king: "K", queen: "Q", rook: "R", bishop: "B", knight: "N",
    }[kind];
    const checkMark = status.state === "checkmate"
        ? "#"
        : status.state === "check" ? "+" : "";
    return `${prefix}${captured ? "x" : ""}${to}`
        + `${promotion ? `=${promotion[0].toUpperCase()}` : ""}${checkMark}`;
}

function createRoomManager() {
    const rooms = new Map();

    function requireRoom(roomId) {
        const room = rooms.get(String(roomId ?? "").toUpperCase());
        if (!room) throw new Error("Room not found. Check the code and try again.");
        return room;
    }

    function findPlayer(room, token) {
        return ["white", "black"]
            .map((color) => room.players[color])
            .find((player) => player?.token === token);
    }

    function createRoom({ name, preferredColor = "white" }) {
        const id = createRoomId(rooms);
        const color = chooseCreatorColor(preferredColor);
        const player = createPlayer(name, color);
        const room = {
            id,
            board: createInitialBoard(),
            players: { white: null, black: null, [color]: player },
            turn: "white",
            status: { state: "waiting", color: "white", winner: null, inCheck: false },
            history: [],
            chat: [],
            rematchRequests: new Set(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        rooms.set(id, room);
        return { room, player };
    }

    function joinRoom({ roomId, name }) {
        const room = requireRoom(roomId);
        const openColor = room.players.white ? "black" : "white";
        if (room.players[openColor]) throw new Error("This room already has two players.");

        const player = createPlayer(name, openColor);
        room.players[openColor] = player;
        room.status = getGameStatus(room.board, room.turn);
        room.updatedAt = Date.now();
        return { room, player };
    }

    function reconnect({ roomId, token }) {
        const room = requireRoom(roomId);
        const player = findPlayer(room, token);
        if (!player) throw new Error("Your seat is no longer available in this room.");
        player.connected = true;
        room.updatedAt = Date.now();
        return { room, player };
    }

    function disconnect(token) {
        for (const room of rooms.values()) {
            const player = findPlayer(room, token);
            if (player) {
                player.connected = false;
                room.updatedAt = Date.now();
                return room;
            }
        }
        return null;
    }

    function makeMove({ roomId, token, from, to, promotion }) {
        const room = requireRoom(roomId);
        const player = findPlayer(room, token);
        if (!player) throw new Error("You do not have a seat in this room.");
        if (!room.players.white || !room.players.black) {
            throw new Error("Wait for the second player to join.");
        }
        if (["checkmate", "stalemate", "resigned", "draw"].includes(room.status.state)) {
            throw new Error("This game is already over.");
        }
        if (room.turn !== player.color) throw new Error("It is not your turn.");

        const movingPiece = room.board[from]?.piece;
        if (!movingPiece || movingPiece.type !== player.color) {
            throw new Error("That piece is not yours.");
        }
        if (!isLegalMove(room.board, from, to)) throw new Error("Illegal move.");

        const capturedPiece = room.board[to].piece;
        room.board[from].piece = null;
        room.board[to].piece = movingPiece;
        movingPiece.currentPosition = to;

        let promotedTo = null;
        const reachedLastRank = pieceKind(movingPiece) === "pawn"
            && ((movingPiece.type === "white" && to[1] === "8")
                || (movingPiece.type === "black" && to[1] === "1"));
        if (reachedLastRank) {
            promotedTo = PROMOTIONS.has(promotion) ? promotion : "queen";
            const label = promotedTo[0].toUpperCase() + promotedTo.slice(1);
            movingPiece.pieceId = `${movingPiece.type === "white" ? "White" : "Black"}${label}`;
            movingPiece.img = `/images/pieces/${movingPiece.type}/${promotedTo}.png`;
        }

        room.turn = otherColor(room.turn);
        room.status = getGameStatus(room.board, room.turn);
        room.history.push({
            ply: room.history.length + 1,
            color: player.color,
            from,
            to,
            notation: notationForMove(
                movingPiece, from, to, capturedPiece, promotedTo, room.status
            ),
            captured: capturedPiece?.pieceId ?? null,
            promotion: promotedTo,
        });
        room.rematchRequests.clear();
        room.updatedAt = Date.now();
        return room;
    }

    function resign({ roomId, token }) {
        const room = requireRoom(roomId);
        const player = findPlayer(room, token);
        if (!player) throw new Error("You do not have a seat in this room.");
        if (!room.players.white || !room.players.black) {
            throw new Error("The game has not started yet.");
        }
        if (["checkmate", "stalemate", "resigned", "draw"].includes(room.status.state)) {
            throw new Error("This game is already over.");
        }
        room.status = {
            state: "resigned",
            color: player.color,
            winner: otherColor(player.color),
            inCheck: false,
        };
        room.updatedAt = Date.now();
        return room;
    }

    function requestRematch({ roomId, token }) {
        const room = requireRoom(roomId);
        const player = findPlayer(room, token);
        if (!player) throw new Error("You do not have a seat in this room.");
        if (!["checkmate", "stalemate", "resigned", "draw"].includes(room.status.state)) {
            throw new Error("A rematch is available after this game ends.");
        }
        room.rematchRequests.add(player.color);
        if (room.rematchRequests.size === 2) {
            room.board = createInitialBoard();
            room.turn = "white";
            room.status = getGameStatus(room.board, room.turn);
            room.history = [];
            room.rematchRequests.clear();
        }
        room.updatedAt = Date.now();
        return room;
    }

    function addChat({ roomId, token, message }) {
        const room = requireRoom(roomId);
        const player = findPlayer(room, token);
        if (!player) throw new Error("You do not have a seat in this room.");
        const text = String(message ?? "").trim().slice(0, 240);
        if (!text) throw new Error("Message cannot be empty.");
        room.chat.push({
            id: crypto.randomUUID(),
            color: player.color,
            name: player.name,
            message: text,
            sentAt: Date.now(),
        });
        room.chat = room.chat.slice(-50);
        room.updatedAt = Date.now();
        return room;
    }

    function snapshot(room, viewerToken) {
        const viewer = findPlayer(room, viewerToken);
        return {
            roomId: room.id,
            board: room.board,
            players: {
                white: publicPlayer(room.players.white),
                black: publicPlayer(room.players.black),
            },
            viewerColor: viewer?.color ?? null,
            turn: room.turn,
            status: room.status,
            history: room.history,
            chat: room.chat,
            rematchRequests: [...room.rematchRequests],
            ready: Boolean(room.players.white && room.players.black),
        };
    }

    return {
        rooms, createRoom, joinRoom, reconnect, disconnect, makeMove, resign,
        requestRematch, addChat, snapshot, requireRoom,
    };
}

export { createRoomManager };
