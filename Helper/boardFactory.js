import { initData } from "../js/data.js";
import {
    BlackBishop, BlackKing, BlackKnight, BlackPawn, BlackQueen, BlackRook,
    WhiteBishop, WhiteKing, WhiteKnight, WhitePawn, WhiteQueen, WhiteRook,
} from "../js/pieceRender.js";

function createPiece(position) {
    if (position[1] === "7") {
        return BlackPawn(position, "/images/pieces/black/pawn.png", "BlackPawn");
    }
    if (position[1] === "2") {
        return WhitePawn(position, "/images/pieces/white/pawn.png", "WhitePawn");
    }

    const pieces = {
        a8: BlackRook(position, "/images/pieces/black/rook.png", "BlackRook"),
        b8: BlackKnight(position, "/images/pieces/black/knight.png", "BlackKnight"),
        c8: BlackBishop(position, "/images/pieces/black/bishop.png", "BlackBishop"),
        d8: BlackQueen(position, "/images/pieces/black/queen.png", "BlackQueen"),
        e8: BlackKing(position, "/images/pieces/black/king.png", "BlackKing"),
        f8: BlackBishop(position, "/images/pieces/black/bishop.png", "BlackBishop"),
        g8: BlackKnight(position, "/images/pieces/black/knight.png", "BlackKnight"),
        h8: BlackRook(position, "/images/pieces/black/rook.png", "BlackRook"),
        a1: WhiteRook(position, "/images/pieces/white/rook.png", "WhiteRook"),
        b1: WhiteKnight(position, "/images/pieces/white/knight.png", "WhiteKnight"),
        c1: WhiteBishop(position, "/images/pieces/white/bishop.png", "WhiteBishop"),
        d1: WhiteQueen(position, "/images/pieces/white/queen.png", "WhiteQueen"),
        e1: WhiteKing(position, "/images/pieces/white/king.png", "WhiteKing"),
        f1: WhiteBishop(position, "/images/pieces/white/bishop.png", "WhiteBishop"),
        g1: WhiteKnight(position, "/images/pieces/white/knight.png", "WhiteKnight"),
        h1: WhiteRook(position, "/images/pieces/white/rook.png", "WhiteRook"),
    };
    return pieces[position] ?? null;
}

function createInitialBoard() {
    const board = {};
    for (const square of initData().flat()) {
        board[square.id] = { ...square, piece: createPiece(square.id) };
    }
    return board;
}

export { createInitialBoard, createPiece };
