import { ROOT_DEV } from "../constants/constantData.js";

const WHITE_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

function orderedPositions(orientation) {
    const ranks = orientation === "black"
        ? [1, 2, 3, 4, 5, 6, 7, 8]
        : [8, 7, 6, 5, 4, 3, 2, 1];
    const files = orientation === "black"
        ? [...WHITE_FILES].reverse()
        : WHITE_FILES;
    return ranks.flatMap((rank) => files.map((file) => `${file}${rank}`));
}

function piecesRender(board) {
    for (const square of Object.values(board)) {
        const squareElement = document.getElementById(square.id);
        if (!squareElement) continue;
        squareElement.querySelector("img")?.remove();
        if (!square.piece) continue;

        const piece = document.createElement("img");
        piece.src = square.piece.img;
        piece.alt = `${square.piece.type} ${square.piece.pieceId
            .replace(/white|black/gi, "")}`;
        piece.draggable = false;
        squareElement.appendChild(piece);
    }
}

function initGame(board, orientation = "white") {
    ROOT_DEV.replaceChildren();
    ROOT_DEV.dataset.orientation = orientation;

    for (const position of orderedPositions(orientation)) {
        const square = board[position];
        const squareBox = document.createElement("button");
        const file = WHITE_FILES.indexOf(position[0]);
        const rank = Number(position[1]);
        const isLight = (file + rank) % 2 === 1;

        squareBox.type = "button";
        squareBox.className = `square ${isLight ? "light" : "dark"}`;
        squareBox.id = position;
        squareBox.dataset.square = position;
        squareBox.setAttribute("aria-label", position);

        const coordinate = document.createElement("span");
        coordinate.className = "coordinate";
        coordinate.textContent = position;
        squareBox.appendChild(coordinate);
        ROOT_DEV.appendChild(squareBox);
    }

    piecesRender(board);
}

export { initGame, piecesRender };
