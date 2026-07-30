import test from "node:test";
import assert from "node:assert/strict";

import { createRoomManager } from "../server/roomManager.js";

function createReadyRoom() {
    const manager = createRoomManager();
    const created = manager.createRoom({
        name: "White Player",
        preferredColor: "white",
    });
    const joined = manager.joinRoom({
        roomId: created.room.id,
        name: "Black Player",
    });
    return {
        manager,
        room: created.room,
        white: created.player,
        black: joined.player,
    };
}

test("creates a private room and assigns the open color to player two", () => {
    const { manager, room, white, black } = createReadyRoom();
    const whiteView = manager.snapshot(room, white.token);
    const blackView = manager.snapshot(room, black.token);

    assert.match(room.id, /^[A-Z2-9]{6}$/);
    assert.equal(white.color, "white");
    assert.equal(black.color, "black");
    assert.equal(whiteView.ready, true);
    assert.equal(whiteView.viewerColor, "white");
    assert.equal(blackView.viewerColor, "black");
    assert.equal("token" in whiteView.players.white, false);
});

test("server rejects moves from the wrong player or wrong turn", () => {
    const { manager, room, white, black } = createReadyRoom();

    assert.throws(() => manager.makeMove({
        roomId: room.id,
        token: black.token,
        from: "e7",
        to: "e5",
    }), /not your turn/);

    assert.throws(() => manager.makeMove({
        roomId: room.id,
        token: white.token,
        from: "e7",
        to: "e5",
    }), /not yours/);
});

test("synchronizes a legal move into the authoritative room state", () => {
    const { manager, room, white } = createReadyRoom();
    manager.makeMove({
        roomId: room.id,
        token: white.token,
        from: "e2",
        to: "e4",
    });

    assert.equal(room.board.e2.piece, null);
    assert.equal(room.board.e4.piece.pieceId, "WhitePawn");
    assert.equal(room.turn, "black");
    assert.equal(room.history[0].notation, "e4");
});

test("detects Fool's Mate through server-authoritative moves", () => {
    const { manager, room, white, black } = createReadyRoom();
    const moves = [
        [white.token, "f2", "f3"],
        [black.token, "e7", "e5"],
        [white.token, "g2", "g4"],
        [black.token, "d8", "h4"],
    ];

    for (const [token, from, to] of moves) {
        manager.makeMove({ roomId: room.id, token, from, to });
    }

    assert.equal(room.status.state, "checkmate");
    assert.equal(room.status.winner, "black");
    assert.equal(room.history.at(-1).notation, "Qh4#");
});

test("reserves player identity for reconnect and resets after mutual rematch", () => {
    const { manager, room, white, black } = createReadyRoom();
    manager.disconnect(white.token);
    assert.equal(room.players.white.connected, false);

    const reconnected = manager.reconnect({ roomId: room.id, token: white.token });
    assert.equal(reconnected.player.connected, true);

    manager.resign({ roomId: room.id, token: black.token });
    manager.requestRematch({ roomId: room.id, token: white.token });
    assert.equal(room.rematchRequests.size, 1);
    manager.requestRematch({ roomId: room.id, token: black.token });

    assert.equal(room.history.length, 0);
    assert.equal(room.turn, "white");
    assert.equal(room.status.state, "active");
    assert.equal(room.board.e2.piece.pieceId, "WhitePawn");
});
