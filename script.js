const toggle = document.querySelector(".toggle");
const menu = document.querySelector(".menu");




if (toggle && menu) {
    toggle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            menu.classList.toggle("show");
        }
    });
    toggle.addEventListener("click", () => {
        menu.classList.toggle("show");
    });
}





function checkCode() {
    const codeInput = document.getElementById("code");
    if (!codeInput) {
        return;
    }
    codeInput.value = "";
    alert("no luck, try another time");
}





function sendMessage(event) {
    event.preventDefault();
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    if (nameInput) {
        nameInput.value = "";
    }
    if (emailInput) {
        emailInput.value = "";
    }
    if (messageInput) {
        messageInput.value = "";
    }
    alert("message sent");
}






function initKeyboardNavigation() {
    const navLinks = Array.from(document.querySelectorAll(".navbar .button"));
    if (!navLinks.length) {
        return;
    }
    navLinks.forEach((link, index) => {
        link.addEventListener("keydown", (event) => {
            let nextIndex = index;
            if (event.key === "ArrowRight") {
                event.preventDefault();
                nextIndex = (index + 1) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                nextIndex = (index - 1 + navLinks.length) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (event.key === " ") {
                event.preventDefault();
                link.click();
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initKeyboardNavigation);
