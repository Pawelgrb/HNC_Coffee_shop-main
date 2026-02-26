
toggle.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        menu.classList.toggle("show");
    }
});

toggle.addEventListener("click",() => {
    menu.classList.toggle("show");
});