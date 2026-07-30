import { getLegalMoves, pieceKind } from "../Helper/gameRules.js";
import { choosePromotion } from "../Helper/pawnPromotion.js";
import { initGame, piecesRender } from "../js/main.js";
import { keySquareMapper, setBoard } from "../js/index.js";

let socket;
let roomState = null;
let roomToken = null;
let selectedPosition = null;
let legalMoves = [];
let reconnectTimer;

const elements = {
    lobby: document.getElementById("lobby"),
    createForm: document.getElementById("create-room-form"),
    joinForm: document.getElementById("join-room-form"),
    joinCode: document.getElementById("join-code"),
    gameShell: document.getElementById("game-shell"),
    connection: document.getElementById("connection-label"),
    connectionDot: document.querySelector(".connection-dot"),
    roomCode: document.getElementById("room-code"),
    copyRoom: document.getElementById("copy-room"),
    status: document.getElementById("game-status"),
    root: document.getElementById("root"),
    whitePlayer: document.getElementById("white-player"),
    blackPlayer: document.getElementById("black-player"),
    moveList: document.getElementById("move-list"),
    chatList: document.getElementById("chat-list"),
    chatForm: document.getElementById("chat-form"),
    chatInput: document.getElementById("chat-input"),
    resign: document.getElementById("resign-button"),
    rematch: document.getElementById("rematch-button"),
    leave: document.getElementById("leave-button"),
    toast: document.getElementById("toast"),
    waiting: document.getElementById("waiting-card"),
    gameOver: document.getElementById("game-over-card"),
    resultTitle: document.getElementById("result-title"),
    resultCopy: document.getElementById("result-copy"),
};

function send(payload) {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    } else {
        showToast("Connection is not ready yet.");
    }
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => elements.toast.classList.remove("show"), 3200);
}

function sessionKey(roomId) {
    return `checkmate-room:${roomId}`;
}

function connect() {
    clearTimeout(reconnectTimer);
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    socket = new WebSocket(`${protocol}//${location.host}/ws`);
    elements.connection.textContent = "Connecting";
    elements.connectionDot.dataset.state = "connecting";

    socket.addEventListener("open", () => {
        elements.connection.textContent = "Live";
        elements.connectionDot.dataset.state = "online";
        const roomId = new URLSearchParams(location.search).get("room")?.toUpperCase();
        const token = roomId && localStorage.getItem(sessionKey(roomId));
        if (roomId && token) {
            send({ type: "reconnect", roomId, token });
        } else if (roomId) {
            elements.joinCode.value = roomId;
            document.querySelector('[data-lobby-tab="join"]').click();
        }
    });

    socket.addEventListener("message", ({ data }) => {
        const message = JSON.parse(data);
        if (message.type === "session") {
            roomToken = message.token;
            localStorage.setItem(sessionKey(message.roomId), message.token);
            history.replaceState({}, "", `?room=${message.roomId}`);
        } else if (message.type === "state") {
            roomState = message.state;
            renderRoom();
        } else if (message.type === "error") {
            showToast(message.message);
            if (!roomState) elements.lobby.classList.remove("hidden");
        }
    });

    socket.addEventListener("close", () => {
        elements.connection.textContent = "Reconnecting";
        elements.connectionDot.dataset.state = "offline";
        reconnectTimer = setTimeout(connect, 1500);
    });
}

function clearHighlights() {
    document.querySelectorAll(".selected, .legal, .capture, .last-move, .in-check")
        .forEach((square) =>
            square.classList.remove("selected", "legal", "capture", "last-move", "in-check")
        );
}

function selectSquare(position) {
    clearHighlights();
    selectedPosition = position;
    legalMoves = getLegalMoves(keySquareMapper, position);
    document.getElementById(position)?.classList.add("selected");
    for (const move of legalMoves) {
        document.getElementById(move)?.classList.add(
            keySquareMapper[move].piece ? "capture" : "legal"
        );
    }
    markPositionContext();
}

function markPositionContext() {
    const lastMove = roomState?.history.at(-1);
    if (lastMove) {
        document.getElementById(lastMove.from)?.classList.add("last-move");
        document.getElementById(lastMove.to)?.classList.add("last-move");
    }
    if (roomState?.status.inCheck) {
        const king = Object.values(keySquareMapper).find((square) =>
            square.piece?.type === roomState.status.color
            && pieceKind(square.piece) === "king"
        );
        document.getElementById(king?.id)?.classList.add("in-check");
    }
}

async function requestMove(from, to) {
    const piece = keySquareMapper[from].piece;
    let promotion;
    const promotes = pieceKind(piece) === "pawn"
        && ((piece.type === "white" && to[1] === "8")
            || (piece.type === "black" && to[1] === "1"));
    if (promotes) promotion = await choosePromotion(piece.type);

    send({ type: "move", roomId: roomState.roomId, from, to, promotion });
    selectedPosition = null;
    legalMoves = [];
}

function canMove() {
    return roomState?.ready
        && roomState.viewerColor === roomState.turn
        && !["checkmate", "stalemate", "resigned", "draw"].includes(roomState.status.state);
}

function handleBoardClick(event) {
    const square = event.target.closest("[data-square]");
    if (!square || !canMove()) return;
    const position = square.dataset.square;

    if (selectedPosition && legalMoves.includes(position)) {
        requestMove(selectedPosition, position);
        return;
    }

    const piece = keySquareMapper[position].piece;
    if (piece?.type === roomState.viewerColor) selectSquare(position);
}

function statusText() {
    if (!roomState.ready) return "Waiting for your opponent";
    const { state, winner } = roomState.status;
    if (state === "checkmate") return `Checkmate · ${winner} wins`;
    if (state === "stalemate") return "Stalemate · Draw";
    if (state === "resigned") return `${winner} wins by resignation`;
    if (state === "draw") return "Draw";
    if (state === "check") return `${roomState.turn} is in check`;
    return roomState.turn === roomState.viewerColor ? "Your move" : "Opponent's move";
}

function renderPlayer(color) {
    const container = color === "white" ? elements.whitePlayer : elements.blackPlayer;
    const player = roomState.players[color];
    container.querySelector(".player-name").textContent = player?.name ?? "Open seat";
    container.querySelector(".player-color").textContent =
        player ? `${color} pieces` : "Waiting to join";
    const presence = container.querySelector(".presence");
    presence.dataset.online = String(Boolean(player?.connected));
    container.classList.toggle("active-turn", roomState.ready && roomState.turn === color);
    container.classList.toggle("is-you", roomState.viewerColor === color);
}

function renderMoves() {
    if (!roomState.history.length) {
        elements.moveList.innerHTML =
            '<li class="empty-state">Moves will appear here once the game begins.</li>';
        return;
    }
    const rows = [];
    for (let index = 0; index < roomState.history.length; index += 2) {
        const white = roomState.history[index];
        const black = roomState.history[index + 1];
        rows.push(`<li><span>${(index / 2) + 1}.</span>`
            + `<strong>${white?.notation ?? ""}</strong>`
            + `<strong>${black?.notation ?? ""}</strong></li>`);
    }
    elements.moveList.innerHTML = rows.join("");
    elements.moveList.scrollTop = elements.moveList.scrollHeight;
}

function renderChat() {
    elements.chatList.innerHTML = roomState.chat.length
        ? roomState.chat.map((item) =>
            `<li class="${item.color === roomState.viewerColor ? "mine" : ""}">`
            + `<span>${escapeHtml(item.name)}</span><p>${escapeHtml(item.message)}</p></li>`
        ).join("")
        : '<li class="chat-empty">No messages yet. Say hello.</li>';
    elements.chatList.scrollTop = elements.chatList.scrollHeight;
}

function escapeHtml(value) {
    const element = document.createElement("span");
    element.textContent = value;
    return element.innerHTML;
}

function renderEndState() {
    const ended = ["checkmate", "stalemate", "resigned", "draw"]
        .includes(roomState.status.state);
    elements.gameOver.classList.toggle("hidden", !ended);
    elements.rematch.hidden = !ended;
    elements.resign.hidden = ended || !roomState.ready;

    if (!ended) return;
    const winner = roomState.status.winner;
    elements.resultTitle.textContent = winner
        ? `${winner[0].toUpperCase() + winner.slice(1)} wins`
        : "Game drawn";
    elements.resultCopy.textContent = roomState.status.state === "checkmate"
        ? "Checkmate. The king has no legal escape."
        : roomState.status.state === "resigned"
            ? "The opponent resigned from the game."
            : "Neither side can force the game forward.";
    const requested = roomState.rematchRequests.includes(roomState.viewerColor);
    elements.rematch.textContent = requested ? "Rematch requested" : "Request rematch";
    elements.rematch.disabled = requested;
}

function renderRoom() {
    elements.lobby.classList.add("hidden");
    elements.gameShell.classList.remove("waiting-for-room");
    elements.gameShell.removeAttribute("aria-hidden");
    elements.roomCode.textContent = roomState.roomId;
    elements.status.textContent = statusText();
    elements.status.dataset.state = roomState.status.state;

    const orientation = roomState.viewerColor ?? "white";
    setBoard(roomState.board);
    if (elements.root.dataset.orientation !== orientation) {
        initGame(keySquareMapper, orientation);
    } else {
        piecesRender(keySquareMapper);
    }
    selectedPosition = null;
    legalMoves = [];
    clearHighlights();
    markPositionContext();

    renderPlayer("white");
    renderPlayer("black");
    renderMoves();
    renderChat();
    renderEndState();

    elements.waiting.classList.toggle("hidden", roomState.ready);
    if (!roomState.ready) {
        elements.waiting.querySelector("strong").textContent = roomState.roomId;
    }

    const opponentColor = roomState.viewerColor === "white" ? "black" : "white";
    const playerOrder = roomState.viewerColor === "black"
        ? [elements.whitePlayer, elements.blackPlayer]
        : [elements.blackPlayer, elements.whitePlayer];
    document.getElementById("opponent-slot").replaceChildren(playerOrder[0]);
    document.getElementById("self-slot").replaceChildren(playerOrder[1]);
    elements.gameShell.dataset.opponent = opponentColor;
}

function setupLobby() {
    document.querySelectorAll("[data-lobby-tab]").forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelectorAll("[data-lobby-tab]").forEach((tab) =>
                tab.classList.toggle("active", tab === button)
            );
            elements.createForm.hidden = button.dataset.lobbyTab !== "create";
            elements.joinForm.hidden = button.dataset.lobbyTab !== "join";
        });
    });

    elements.createForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        send({
            type: "create_room",
            name: data.get("name"),
            preferredColor: data.get("color"),
        });
    });

    elements.joinForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        send({
            type: "join_room",
            roomId: String(data.get("roomId")).toUpperCase(),
            name: data.get("name"),
        });
    });
}

function setupControls() {
    elements.root.addEventListener("click", handleBoardClick);
    elements.copyRoom.addEventListener("click", async () => {
        const invite = `${location.origin}?room=${roomState.roomId}`;
        await navigator.clipboard.writeText(invite);
        showToast("Invite link copied.");
    });
    elements.resign.addEventListener("click", () => {
        if (confirm("Resign this game?")) {
            send({ type: "resign", roomId: roomState.roomId });
        }
    });
    elements.rematch.addEventListener("click", () =>
        send({ type: "rematch", roomId: roomState.roomId })
    );
    elements.leave.addEventListener("click", () => {
        localStorage.removeItem(sessionKey(roomState.roomId));
        location.href = location.pathname;
    });
    elements.chatForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = elements.chatInput.value;
        if (!message.trim()) return;
        send({ type: "chat", roomId: roomState.roomId, message });
        elements.chatInput.value = "";
    });
}

function GlobalEvents() {
    setupLobby();
    setupControls();
    connect();
}

export { GlobalEvents };
