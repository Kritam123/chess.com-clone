import { keySquareMapper } from "../js/index.js";
import { ROOT_DEV } from "../constants/constantData.js";
import {
    capturePositionHighlight,
    clearCaptureHighlight,
    clearPreviousHighlight,
    clearPreviousSelfHighlight,
    globalClearHighlight,
    highlightPieces,
    highlightSelf,
} from "../HighlightPieces/highlight.js";
import { pawnPromotion } from "../Helper/pawnPromotion.js";
import { findKing, getGameStatus, getLegalMoves } from "../Helper/gameRules.js";

let selectedSquare = null;
let legalEmptyPositions = [];
let legalCapturePositions = [];
let inTurn = "white";
let gameOver = false;

function titleCase(value) {
    return value[0].toUpperCase() + value.slice(1);
}

function setStatus(status) {
    const statusElement = document.getElementById("game-status");
    if (!statusElement) return;

    if (status.state === "checkmate") {
        statusElement.textContent = `Checkmate — ${titleCase(status.winner)} wins`;
    } else if (status.state === "stalemate") {
        statusElement.textContent = "Stalemate — draw";
    } else if (status.state === "check") {
        statusElement.textContent = `${titleCase(status.color)} is in check`;
    } else {
        statusElement.textContent = `${titleCase(status.color)} to move`;
    }
    statusElement.dataset.state = status.state;
}

function showCheckedKing(status) {
    document.querySelectorAll(".in-check")
        .forEach((element) => element.classList.remove("in-check"));

    if (status.inCheck) {
        const kingPosition = findKing(keySquareMapper, status.color);
        document.getElementById(kingPosition)?.classList.add("in-check");
    }
}

function clearSelection() {
    clearPreviousHighlight(legalEmptyPositions);
    clearCaptureHighlight(legalCapturePositions);
    clearPreviousSelfHighlight(selectedSquare?.id);
    selectedSquare = null;
    legalEmptyPositions = [];
    legalCapturePositions = [];
}

function selectPiece(square) {
    if (selectedSquare?.id === square.id) {
        clearSelection();
        return;
    }

    globalClearHighlight(selectedSquare?.piece);
    selectedSquare = square;
    const legalMoves = getLegalMoves(keySquareMapper, square.id);
    legalEmptyPositions = legalMoves.filter(
        (position) => !keySquareMapper[position].piece
    );
    legalCapturePositions = legalMoves.filter(
        (position) => Boolean(keySquareMapper[position].piece)
    );

    for (const position of legalEmptyPositions) {
        keySquareMapper[position].highlight_state = true;
    }
    highlightPieces(legalEmptyPositions);
    capturePositionHighlight(legalCapturePositions);
    highlightSelf(square.id);
}

function renderMove(fromSquare, toSquare) {
    const movingPiece = fromSquare.piece;
    const fromElement = document.getElementById(fromSquare.id);
    const toElement = document.getElementById(toSquare.id);

    movingPiece.currentPosition = toSquare.id;
    toSquare.piece = movingPiece;
    fromSquare.piece = null;
    fromElement.firstChild?.remove();
    toElement.firstChild?.remove();

    const pieceElement = document.createElement("img");
    pieceElement.src = movingPiece.img;
    toElement.appendChild(pieceElement);
}

function completeTurn() {
    inTurn = inTurn === "white" ? "black" : "white";
    const status = getGameStatus(keySquareMapper, inTurn);
    gameOver = status.state === "checkmate" || status.state === "stalemate";
    showCheckedKing(status);
    setStatus(status);
}

function moveSelectedPiece(destination) {
    const destinationSquare = keySquareMapper[destination];
    const sourceSquare = selectedSquare;
    renderMove(sourceSquare, destinationSquare);
    clearSelection();

    const promotionPending = pawnPromotion(destinationSquare, completeTurn);
    if (!promotionPending) completeTurn();
}

function GlobalEvents() {
    setStatus(getGameStatus(keySquareMapper, inTurn));

    ROOT_DEV.addEventListener("click", (event) => {
        if (gameOver) return;

        const squareElement = event.target.closest(".square");
        const square = squareElement && keySquareMapper[squareElement.id];
        if (!square) return;

        const legalDestinations = [
            ...legalEmptyPositions,
            ...legalCapturePositions,
        ];
        if (selectedSquare && legalDestinations.includes(square.id)) {
            moveSelectedPiece(square.id);
            return;
        }
        if (square.piece?.type === inTurn) selectPiece(square);
    });
}

export { GlobalEvents };
