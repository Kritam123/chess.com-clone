const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function toPosition(file, rank) {
    if (file < 0 || file > 7 || rank < 1 || rank > 8) {
        return null;
    }
    return `${FILES[file]}${rank}`;
}

function fromPosition(position) {
    return {
        file: FILES.indexOf(position?.[0]),
        rank: Number(position?.[1]),
    };
}

function pieceKind(piece) {
    const id = piece?.pieceId?.toLowerCase() ?? "";
    return ["pawn", "rook", "knight", "bishop", "queen", "king"]
        .find((kind) => id.includes(kind));
}

function addStepMove(board, moves, piece, file, rank) {
    const position = toPosition(file, rank);
    if (!position) return;

    const target = board[position]?.piece;
    if (!target || target.type !== piece.type) {
        moves.push(position);
    }
}

function addRayMoves(board, moves, piece, file, rank, fileStep, rankStep) {
    let nextFile = file + fileStep;
    let nextRank = rank + rankStep;

    while (toPosition(nextFile, nextRank)) {
        const position = toPosition(nextFile, nextRank);
        const target = board[position]?.piece;

        if (!target) {
            moves.push(position);
        } else {
            if (target.type !== piece.type) moves.push(position);
            break;
        }

        nextFile += fileStep;
        nextRank += rankStep;
    }
}

function getPseudoLegalMoves(board, position) {
    const piece = board[position]?.piece;
    if (!piece) return [];

    const { file, rank } = fromPosition(position);
    const kind = pieceKind(piece);
    const moves = [];

    if (kind === "pawn") {
        const direction = piece.type === "white" ? 1 : -1;
        const homeRank = piece.type === "white" ? 2 : 7;
        const oneForward = toPosition(file, rank + direction);

        if (oneForward && !board[oneForward]?.piece) {
            moves.push(oneForward);
            const twoForward = toPosition(file, rank + (2 * direction));
            if (rank === homeRank && twoForward && !board[twoForward]?.piece) {
                moves.push(twoForward);
            }
        }

        for (const fileStep of [-1, 1]) {
            const capture = toPosition(file + fileStep, rank + direction);
            const target = capture && board[capture]?.piece;
            if (target && target.type !== piece.type) moves.push(capture);
        }
    } else if (kind === "knight") {
        for (const [fileStep, rankStep] of [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1],
        ]) {
            addStepMove(board, moves, piece, file + fileStep, rank + rankStep);
        }
    } else if (kind === "king") {
        for (let fileStep = -1; fileStep <= 1; fileStep++) {
            for (let rankStep = -1; rankStep <= 1; rankStep++) {
                if (fileStep || rankStep) {
                    addStepMove(board, moves, piece, file + fileStep, rank + rankStep);
                }
            }
        }
    } else {
        const directions = [];
        if (kind === "rook" || kind === "queen") {
            directions.push([0, 1], [0, -1], [1, 0], [-1, 0]);
        }
        if (kind === "bishop" || kind === "queen") {
            directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
        }
        for (const [fileStep, rankStep] of directions) {
            addRayMoves(board, moves, piece, file, rank, fileStep, rankStep);
        }
    }

    return moves;
}

function getAttackSquares(board, position) {
    const piece = board[position]?.piece;
    if (!piece) return [];

    const { file, rank } = fromPosition(position);
    const kind = pieceKind(piece);

    if (kind === "pawn") {
        const direction = piece.type === "white" ? 1 : -1;
        return [-1, 1]
            .map((fileStep) => toPosition(file + fileStep, rank + direction))
            .filter(Boolean);
    }

    if (kind === "knight") {
        return [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1],
        ].map(([fileStep, rankStep]) =>
            toPosition(file + fileStep, rank + rankStep)
        ).filter(Boolean);
    }

    if (kind === "king") {
        const attacks = [];
        for (let fileStep = -1; fileStep <= 1; fileStep++) {
            for (let rankStep = -1; rankStep <= 1; rankStep++) {
                if (fileStep || rankStep) {
                    const target = toPosition(file + fileStep, rank + rankStep);
                    if (target) attacks.push(target);
                }
            }
        }
        return attacks;
    }

    const attacks = [];
    const directions = [];
    if (kind === "rook" || kind === "queen") {
        directions.push([0, 1], [0, -1], [1, 0], [-1, 0]);
    }
    if (kind === "bishop" || kind === "queen") {
        directions.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
    }

    for (const [fileStep, rankStep] of directions) {
        let nextFile = file + fileStep;
        let nextRank = rank + rankStep;
        while (toPosition(nextFile, nextRank)) {
            const target = toPosition(nextFile, nextRank);
            attacks.push(target);
            if (board[target]?.piece) break;
            nextFile += fileStep;
            nextRank += rankStep;
        }
    }
    return attacks;
}

function isSquareAttacked(board, position, attackingColor) {
    return Object.values(board).some((square) =>
        square.piece?.type === attackingColor
        && getAttackSquares(board, square.id).includes(position)
    );
}

function findKing(board, color) {
    return Object.values(board).find((square) =>
        square.piece?.type === color && pieceKind(square.piece) === "king"
    )?.id;
}

function isKingInCheck(board, color) {
    const kingPosition = findKing(board, color);
    if (!kingPosition) return true;

    const opponent = color === "white" ? "black" : "white";
    return isSquareAttacked(board, kingPosition, opponent);
}

function isLegalMove(board, from, to) {
    const piece = board[from]?.piece;
    const target = board[to]?.piece;
    if (
        !piece
        || target?.type === piece.type
        || pieceKind(target) === "king"
        || !getPseudoLegalMoves(board, from).includes(to)
    ) {
        return false;
    }

    board[from].piece = null;
    board[to].piece = piece;
    const previousPosition = piece.currentPosition;
    piece.currentPosition = to;
    const leavesKingInCheck = isKingInCheck(board, piece.type);
    piece.currentPosition = previousPosition;
    board[from].piece = piece;
    board[to].piece = target ?? null;

    return !leavesKingInCheck;
}

function getLegalMoves(board, position) {
    return getPseudoLegalMoves(board, position)
        .filter((destination) => isLegalMove(board, position, destination));
}

function getAllLegalMoves(board, color) {
    return Object.values(board)
        .filter((square) => square.piece?.type === color)
        .flatMap((square) =>
            getLegalMoves(board, square.id).map((to) => ({ from: square.id, to }))
        );
}

function getGameStatus(board, colorToMove) {
    const inCheck = isKingInCheck(board, colorToMove);
    const hasLegalMove = getAllLegalMoves(board, colorToMove).length > 0;

    if (!hasLegalMove && inCheck) {
        return {
            state: "checkmate",
            color: colorToMove,
            winner: colorToMove === "white" ? "black" : "white",
            inCheck,
        };
    }
    if (!hasLegalMove) {
        return {
            state: "stalemate",
            color: colorToMove,
            winner: null,
            inCheck,
        };
    }
    return {
        state: inCheck ? "check" : "active",
        color: colorToMove,
        winner: null,
        inCheck,
    };
}

export {
    findKing,
    getAllLegalMoves,
    getGameStatus,
    getLegalMoves,
    getPseudoLegalMoves,
    isKingInCheck,
    isLegalMove,
    isSquareAttacked,
    pieceKind,
};
