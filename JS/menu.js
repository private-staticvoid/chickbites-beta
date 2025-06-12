const menuItems = [
  { id: 1, category: "chicken", name: "Original Chicken", price: 100, desc: "Classic fried chicken.", img: "../images/original chicken.png" },
  { id: 2, category: "chicken", name: "Garlic Chicken", price: 120, desc: "Fried chicken with garlic flavor.", img: "../images/garlic chicken.png" },
  { id: 3, category: "chicken", name: "Spicy Chicken", price: 120, desc: "Delicious spicy fried chicken.", img: "../images/spicy chicken.png" },
  { id: 4, category: "chicken", name: "Yangnyeom Chicken", price: 120, desc: "Korean style fried chicken.", img: "../images/Yangnyeom Chicken.png" },

  { id: 5, category: "pasta", name: "Mac n Cheese", price: 100, desc: "Cheesy macaroni pasta.", img: "../images/mac n cheese.png" },
  { id: 6, category: "pasta", name: "Spaghetti", price: 90, desc: "Classic tomato-based spaghetti.", img: "../images/spaghetti.png" },
  { id: 7, category: "pasta", name: "Carbonara", price: 90, desc: "Creamy white sauce pasta.", img: "../images/carbonara.png" },

  { id: 8, category: "addons", name: "Fries", price: 50, desc: "Crispy fried potatoes.", img: "../images/fries.png" },
  { id: 9, category: "addons", name: "Rice", price: 20, desc: "Steamed white rice.", img: "../images/rice.png" },
  { id: 10, category: "addons", name: "Extra Garlic", price: 10, desc: "Additional garlic topping.", img: "../images/extra garlic.png" },
  { id: 11, category: "addons", name: "Extra Sauce", price: 15, desc: "Extra serving of sauce.", img: "../images/extra sauces.png" },
  { id: 12, category: "addons", name: "Caramelized Onions", price: 30, desc: "Sweet caramelized onions.", img: "../images/caramelized onions.png" },

  { id: 13, category: "drinks", name: "Mineral Water", price: 20, desc: "Bottled mineral water.", img: "../images/mineral water.png" },
  { id: 14, category: "drinks", name: "Coke", price: 40, desc: "Chilled Coca-Cola.", img: "../images/coke.png" },
  { id: 15, category: "drinks", name: "Coke Zero", price: 40, desc: "Zero sugar Coca-Cola.", img: "../images/coke zero.png" },
  { id: 16, category: "drinks", name: "Sprite", price: 40, desc: "Chilled lemon-lime soda.", img: "../images/sprite.png" },
];

const comboMeals = [
  { id: 101, category: "combo", name: "Original Chicken + Spaghetti", price: 175, desc: "A combo of Original Chicken and Spaghetti.", img: "../images/Combo (1).png", isCombo: true, comboID: 1 },
  { id: 102, category: "combo", name: "Mix n Match", price: 200, desc: "Any Flavored Chicken + Any Pasta", img: "../images/Combo (2).png", isCombo: true, comboID: 2 },
  { id: 103, category: "combo", name: "Original Chicken + Spaghetti + Drink", price: 205, desc: "Original Chicken, Spaghetti, and coke.", img: "../images/Combo (3).png", isCombo: true, comboID: 3 },
  { id: 104, category: "combo", name: "Mix n Match + Drinks", price: 230, desc: "Chicken + Pasta + Drink", img: "../images/Combo (4).png", isCombo: true, comboID: 4 },
];

const deliveryFeeAmount = 50;

const menuContainer = document.querySelector(".menu-items");
const cartContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const deliveryFeeEl = document.getElementById("deliveryFee");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const categoryButtons = document.querySelectorAll(".categories button");

let cart = [];

function renderMenuItems(category = "all") {
  menuContainer.innerHTML = "";
  let items = [];

  if (category === "all") {
    items = [...menuItems, ...comboMeals];
  } else if (category === "combo") {
    items = comboMeals;
  } else {
    items = menuItems.filter(i => i.category === category);
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "menu-card";

    let customOptions = "";

    if (item.comboID === 2 || item.comboID === 4) {
      customOptions += `
        <label>Chicken:
          <select class="chicken-select">
            <option>Original</option>
            <option>Garlic</option>
            <option>Spicy</option>
            <option>Yangnyeom</option>
          </select>
        </label>
        <label>Pasta:
          <select class="pasta-select">
            <option>Mac n Cheese</option>
            <option>Spaghetti</option>
            <option>Carbonara</option>
          </select>
        </label>
      `;
      if (item.comboID === 4) {
        customOptions += `
          <label>Drink:
            <select class="drink-select">
              <option>Mineral Water</option>
              <option>Coke</option>
              <option>Coke Zero</option>
              <option>Sprite</option>
            </select>
          </label>
        `;
      }
    }

    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="details">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="price">₱${item.price}</div>
        ${customOptions}
        <button data-id="${item.id}" data-combo="${item.isCombo ? "true" : "false"}">Add</button>
      </div>
    `;
    menuContainer.appendChild(card);
  });

  menuContainer.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const isCombo = btn.dataset.combo === "true";

      const parent = btn.closest(".details");
      const chicken = parent.querySelector(".chicken-select")?.value || null;
      const pasta = parent.querySelector(".pasta-select")?.value || null;
      const drink = parent.querySelector(".drink-select")?.value || null;

      addToCart(id, isCombo, { chicken, pasta, drink });
    });
  });
}

function addToCart(id, isCombo, options = {}) {
  const source = isCombo ? comboMeals : menuItems;
  const item = source.find(i => i.id === id);
  const existing = cart.find(i =>
    i.id === id &&
    (i.isCombo || false) === isCombo &&
    JSON.stringify(i.options) === JSON.stringify(options)
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      isCombo: item.isCombo || false,
      comboID: item.comboID || null,
      options: options
    });
  }

  renderCart();
}

function renderCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = "₱0";
    deliveryFeeEl.textContent = "₱0";
    totalEl.textContent = "₱0";
    checkoutBtn.textContent = "Checkout (0)";
    checkoutBtn.disabled = true;
    return;
  }

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    const optionDetails = item.options
      ? `<small>${item.options.chicken || ""} ${item.options.pasta || ""} ${item.options.drink || ""}</small>`
      : "";

    el.innerHTML = `
      <div class="name">${item.name}<br/>${optionDetails}</div>
      <div class="quantity">
        <button class="minus" data-id="${item.id}" data-combo="${item.isCombo}" data-options='${JSON.stringify(item.options)}'>-</button>
        <input type="text" readonly value="${item.quantity}" />
        <button class="plus" data-id="${item.id}" data-combo="${item.isCombo}" data-options='${JSON.stringify(item.options)}'>+</button>
        <div class="price">₱${item.price * item.quantity}</div>
      </div>
    `;
    cartContainer.appendChild(el);
  });

  cartContainer.querySelectorAll(".plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const isCombo = btn.dataset.combo === "true";
      const options = JSON.parse(btn.dataset.options);
      changeQuantity(id, isCombo, 1, options);
    });
  });

  cartContainer.querySelectorAll(".minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const isCombo = btn.dataset.combo === "true";
      const options = JSON.parse(btn.dataset.options);
      changeQuantity(id, isCombo, -1, options);
    });
  });

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? deliveryFeeAmount : 0;
  const total = subtotal + deliveryFee;

  subtotalEl.textContent = `₱${subtotal}`;
  deliveryFeeEl.textContent = `₱${deliveryFee}`;
  totalEl.textContent = `₱${total}`;
  checkoutBtn.textContent = `Checkout (${cart.reduce((sum, item) => sum + item.quantity, 0)})`;
  checkoutBtn.disabled = false;
}

function changeQuantity(id, isCombo, delta, options) {
  const item = cart.find(i =>
    i.id === id &&
    (i.isCombo || false) === isCombo &&
    JSON.stringify(i.options) === JSON.stringify(options)
  );
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i =>
      !(i.id === id &&
        (i.isCombo || false) === isCombo &&
        JSON.stringify(i.options) === JSON.stringify(options))
    );
  }
  renderCart();
}

categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderMenuItems(btn.dataset.category);
  });
});

checkoutBtn.addEventListener("click", () => {
  const cartData = {
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      isCombo: item.isCombo,
      comboID: item.comboID,
      options: item.options
    })),
    deliveryFee: deliveryFeeAmount,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryFeeAmount
  };

  localStorage.setItem("checkoutCart", JSON.stringify(cartData));
  window.location.href = "checkout.html";
});

renderMenuItems();
renderCart();

document.addEventListener('DOMContentLoaded', () => {
  const cartToggle = document.querySelector('.cart-menu-toggle');
  const cart = document.querySelector('.cart');
  const closeBtn = document.querySelector('.close-cart-btn');

  if (cartToggle && cart) {
    cartToggle.addEventListener('click', () => {
      cart.classList.add('open');
    });
  }

  if (closeBtn && cart) {
    closeBtn.addEventListener('click', () => {
      cart.classList.remove('open');
    });
  }
});

