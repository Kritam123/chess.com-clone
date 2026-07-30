import test from "node:test";
import assert from "node:assert/strict";

import {
    getGameStatus,
    getLegalMoves,
    isKingInCheck,
} from "../Helper/gameRules.js";

function board(pieces) {
    const result = {};
    for (const file of "abcdefgh") {
        for (let rank = 1; rank <= 8; rank++) {
            const id = `${file}${rank}`;
            result[id] = { id, piece: null };
        }
    }

    for (const [position, type, kind] of pieces) {
        result[position].piece = {
            currentPosition: position,
            type,
            pieceId: `${type}${kind}`,
        };
    }
    return result;
}

test("detects checkmate when the checked king has no legal move", () => {
    const position = board([
        ["a8", "black", "King"],
        ["b7", "white", "Queen"],
        ["c6", "white", "King"],
    ]);

    assert.deepEqual(getGameStatus(position, "black"), {
        state: "checkmate",
        color: "black",
        winner: "white",
        inCheck: true,
    });
});

test("detects stalemate when the king is safe but has no legal move", () => {
    const position = board([
        ["a8", "black", "King"],
        ["c7", "white", "Queen"],
        ["c6", "white", "King"],
    ]);

    assert.deepEqual(getGameStatus(position, "black"), {
        state: "stalemate",
        color: "black",
        winner: null,
        inCheck: false,
    });
});

test("does not allow a pinned piece to expose its king", () => {
    const position = board([
        ["e1", "white", "King"],
        ["e2", "white", "Rook"],
        ["e8", "black", "Rook"],
        ["a8", "black", "King"],
    ]);

    assert.equal(getLegalMoves(position, "e2").includes("d2"), false);
    assert.equal(getLegalMoves(position, "e2").includes("e3"), true);
});

test("does not allow a king to move onto an attacked square", () => {
    const position = board([
        ["e1", "white", "King"],
        ["e8", "black", "King"],
        ["a2", "black", "Rook"],
    ]);

    assert.equal(getLegalMoves(position, "e1").includes("e2"), false);
    assert.equal(getLegalMoves(position, "e1").includes("f1"), true);
});

test("does not allow a king to capture a piece protected by its king", () => {
    const position = board([
        ["e4", "white", "King"],
        ["e6", "black", "King"],
        ["e5", "black", "Pawn"],
    ]);

    assert.equal(getLegalMoves(position, "e4").includes("e5"), false);
});

test("a double pawn move is blocked by the first square", () => {
    const position = board([
        ["e1", "white", "King"],
        ["e8", "black", "King"],
        ["d2", "white", "Pawn"],
        ["d3", "black", "Knight"],
    ]);

    assert.deepEqual(getLegalMoves(position, "d2"), []);
});

test("reports ordinary check while legal replies remain", () => {
    const position = board([
        ["e1", "white", "King"],
        ["e8", "black", "King"],
        ["e7", "white", "Rook"],
    ]);

    assert.equal(isKingInCheck(position, "black"), true);
    assert.equal(getGameStatus(position, "black").state, "check");
});
