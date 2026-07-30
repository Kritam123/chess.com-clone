function pawnPromotion(square, onComplete) {
    const isPromotion =
        (Number(square.piece.currentPosition[1]) === 8
            && square.piece.pieceId === "WhitePawn")
        || (Number(square.piece.currentPosition[1]) === 1
            && square.piece.pieceId === "BlackPawn");

    if (!isPromotion) {
        return false;
    }

    const color = square.piece.type;
    const popup = document.querySelector(".fixed");
    const choices = document.querySelector(`.${color}Pieces`);
    popup.style.display = "flex";
    choices.style.display = "flex";

    function selectPromotion(event) {
        const choice = event.target.closest("li");
        if (!choice) return;

        square.piece.pieceId = choice.id;
        square.piece.img = choice.querySelector("img").src;
        document.getElementById(square.id).querySelector("img").src =
            square.piece.img;

        choices.style.display = "none";
        popup.style.display = "none";
        choices.removeEventListener("click", selectPromotion);
        onComplete?.();
    }

    choices.addEventListener("click", selectPromotion);
    return true;
}

export { pawnPromotion };
