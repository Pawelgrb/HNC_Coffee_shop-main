const CART_STORAGE_KEY = "beanAndBrewCart";

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











function payOrder(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    localStorage.removeItem(CART_STORAGE_KEY);
    window.location.href = "checkout_end.html";
}



function getCartItems() {
    try {
        const rawCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = rawCart ? JSON.parse(rawCart) : [];
        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        return [];
    }
}
function updateCheckoutBadge() {
    const checkoutCount = document.getElementById("checkout-count");
    if (!checkoutCount) {
        return;
    }
    const count = getCartItems().length;
    if (count > 0) {
        checkoutCount.textContent = `+${count}`;
        checkoutCount.style.display = "inline-block";
    } else {
        checkoutCount.textContent = "";
        checkoutCount.style.display = "none";
    }
}






function Price(priceText) {
    const text = priceText ?? "";
    const string_value = String(text);
    let numericOnly = "";
    for (let char of string_value) {
        if ((char >= "0" && char <= "9") || char === ".") {
            numericOnly += char;
        }
    }
    const value = parseFloat(numericOnly);
    if (Number.isFinite(value)) {
        return value;
    }
    return 0;
}




function renderCheckoutItems() {
    const checkoutItems = document.getElementById("checkout-items");
    const checkoutEmpty = document.getElementById("checkout-empty");
    const checkoutTotal = document.getElementById("checkout-total");
    if (!checkoutItems || !checkoutEmpty || !checkoutTotal) {
        return;
    }
    const cartItems = getCartItems();
    checkoutItems.innerHTML = "";
    if (!cartItems.length) {
        checkoutEmpty.textContent = "Your basket is empty.";
        checkoutTotal.textContent = "Total: GBP 0.00";
        return;
    }
    checkoutEmpty.textContent = "";
    const groupedItems = new Map();
    cartItems.forEach((item) => {
        const key = `${item.name}||${item.price}`;
        if (!groupedItems.has(key)) {
            groupedItems.set(key, { name: item.name, price: item.price, quantity: 0 });
        }
        groupedItems.get(key).quantity += 1;
    });
    let total = 0;
    groupedItems.forEach((entry) => {
        const listItem = document.createElement("li");
        const amount = Price(entry.price);
        total += amount * entry.quantity;
        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${entry.name} x${entry.quantity}`;
        const priceSpan = document.createElement("span");
        priceSpan.textContent = entry.price;
        listItem.appendChild(nameSpan);
        listItem.appendChild(priceSpan);
        checkoutItems.appendChild(listItem);
    });
    checkoutTotal.textContent = `Total: GBP ${total.toFixed(2)}`;
}















function CheckoutPage() {
    const checkoutItems = document.getElementById("checkout-items");
    if (!checkoutItems) {
        return;
    }
    renderCheckoutItems();
}

function Nav_Keyboard() {
    const navLinks = Array.from(document.querySelectorAll(".navbar .button"));
    if (!navLinks.length) {
        return;
    }
    navLinks.forEach((link, index) => {
        link.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                const nextIndex = (index + 1) % navLinks.length;
                navLinks[nextIndex].focus();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                const previousIndex = (index - 1 + navLinks.length) % navLinks.length;
                navLinks[previousIndex].focus();
            }  else if (event.key === " ") {
                event.preventDefault();
                link.click();
            }
        });
    });
}
function ShopPage() {
    const buyButtons = Array.from(document.querySelectorAll(".buy-btn"));
    if (!buyButtons.length) {
        return;
    }
    updateCheckoutBadge();
    buyButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productCard = button.closest(".product-card");
            const nameElement = productCard ? productCard.querySelector(".product-name") : null;
            const priceElement = productCard ? productCard.querySelector(".product-price") : null;
            const newItem = {
                name: nameElement ? nameElement.textContent.trim() : "Coffee Item",
                price: priceElement ? priceElement.textContent.trim() : "0"
            };
            const cartItems = getCartItems();
            cartItems.push(newItem);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
            updateCheckoutBadge();
        });
    });
}

function ShopImageFallbacks() {
    const productImages = Array.from(document.querySelectorAll(".shop-grid .product-img img"));
    if (!productImages.length) {
        return;
    }
    productImages.forEach((image) => {
        const startSrc = image.getAttribute("src");
        if (!startSrc) {
            return;
        }
        const candidates = [];
        const addCandidate = (value) => {
            if (!value || candidates.includes(value)) {
                return;
            }
            candidates.push(value);
        };
        addCandidate(startSrc);
        const trimmedSrc = startSrc.replace(/^\.?\//, "");
        if (trimmedSrc.startsWith("pictures/")) {
            addCandidate(`./${trimmedSrc}`);
            addCandidate(trimmedSrc);
            addCandidate(`/${trimmedSrc}`);
            const encoded = encodeURI(trimmedSrc);
            addCandidate(`./${encoded}`);
            addCandidate(encoded);
            addCandidate(`/${encoded}`);
            try {
                const decoded = decodeURI(trimmedSrc);
                addCandidate(`./${decoded}`);
                addCandidate(decoded);
                addCandidate(`/${decoded}`);
            } catch (error) {
            }
        }
        let candidateIndex = 0;
        image.addEventListener("error", () => {
            candidateIndex += 1;
            if (candidateIndex < candidates.length) {
                image.src = candidates[candidateIndex];
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    Nav_Keyboard();
    ShopPage();
    ShopImageFallbacks();
    CheckoutPage();
});
