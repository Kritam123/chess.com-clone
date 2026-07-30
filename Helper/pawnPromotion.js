function choosePromotion(color) {
    const dialog = document.getElementById("promotion-dialog");
    const choices = dialog.querySelectorAll("[data-promotion]");

    for (const choice of choices) {
        choice.querySelector("img").src =
            `/images/pieces/${color}/${choice.dataset.promotion}.png`;
    }

    dialog.showModal();
    return new Promise((resolve) => {
        function select(event) {
            const choice = event.target.closest("[data-promotion]");
            if (!choice) return;
            dialog.removeEventListener("click", select);
            dialog.close();
            resolve(choice.dataset.promotion);
        }
        dialog.addEventListener("click", select);
    });
}

export { choosePromotion };
