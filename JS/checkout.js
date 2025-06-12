document.addEventListener("DOMContentLoaded", function () {
  // Safely set year
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const cartData = JSON.parse(localStorage.getItem("checkoutCart"));
  const cartItems = cartData?.items || [];
  const deliveryFee = cartData?.deliveryFee || 60;
  let subtotal = cartData?.subtotal || 0;
  let currentDiscount = 0;

  const cartContainer = document.getElementById("cartItemsContainer");
  const subtotalSpan = document.getElementById("subtotal");
  const deliveryFeeSpan = document.getElementById("deliveryFee");
  const totalSpan = document.getElementById("total");
  const voucherInput = document.getElementById("voucherInput");
  const voucherMessage = document.getElementById("voucherMessage");

  const savedAddress = document.getElementById("savedAddress");
  const userAddress = localStorage.getItem("userAddress");
  if (savedAddress && userAddress) {
    savedAddress.textContent = userAddress;
  }

  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <p>Quantity: ${item.quantity}</p>
        </div>
        <div class="price">₱${itemTotal}</div>
      `;
      cartContainer.appendChild(itemDiv);
    });
  }

  subtotalSpan.textContent = `₱${subtotal}`;
  deliveryFeeSpan.textContent = `₱${deliveryFee}`;
  totalSpan.textContent = `₱${subtotal + deliveryFee}`;

  const deliveryBtn = document.getElementById("deliveryBtn");
  const pickupBtn = document.getElementById("pickupBtn");

  function updateTotalWithDiscount() {
    const deliveryMethod = deliveryBtn.classList.contains("active") ? "Delivery" : "Pickup";
    const deliveryFeeFinal = deliveryMethod === "Delivery" ? deliveryFee : 0;
    const finalTotal = Math.max(subtotal + deliveryFeeFinal - currentDiscount, 0);
    deliveryFeeSpan.textContent = `₱${deliveryFeeFinal}`;
    totalSpan.textContent = `₱${finalTotal}`;
  }

  deliveryBtn.addEventListener("click", () => {
    deliveryBtn.classList.add("active");
    pickupBtn.classList.remove("active");
    updateTotalWithDiscount();
  });

  pickupBtn.addEventListener("click", () => {
    pickupBtn.classList.add("active");
    deliveryBtn.classList.remove("active");
    updateTotalWithDiscount();
  });

  const codBtn = document.getElementById("codBtn");
  const ewalletBtn = document.getElementById("ewalletBtn");

  codBtn.addEventListener("click", () => {
    codBtn.classList.add("active");
    ewalletBtn.classList.remove("active");
  });

  ewalletBtn.addEventListener("click", () => {
    ewalletBtn.classList.add("active");
    codBtn.classList.remove("active");
  });

  voucherInput.addEventListener("input", () => {
    const code = voucherInput.value.trim().toUpperCase();
    const userId = localStorage.getItem("userId") || "guest";
    const usedVouchersKey = `usedVouchers_${userId}`;
    const usedVouchers = JSON.parse(localStorage.getItem(usedVouchersKey)) || [];

    let discount = 0;
    let message = "";
    let isValid = false;

    if (usedVouchers.includes(code)) {
      message = "❌ Voucher already used.";
    } else if (code === "100PESOSOFF") {
      discount = 100;
      message = "✅ Valid voucher! ₱100 off.";
      isValid = true;
    } else if (code === "50PESOSOFF") {
      discount = 50;
      message = "✅ Valid voucher! ₱50 off.";
      isValid = true;
    } else if (code === "") {
      message = "";
    } else {
      message = "❌ Invalid code.";
    }

    currentDiscount = isValid ? discount : 0;
    voucherMessage.textContent = message;
    voucherMessage.style.color = isValid ? "green" : "red";
    updateTotalWithDiscount();
  });

  document.getElementById("placeOrderBtn").addEventListener("click", () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const deliveryMethod = deliveryBtn.classList.contains("active") ? "Delivery" : "Pickup";
    const paymentMethod = codBtn.classList.contains("active") ? "Cash on Delivery" : "E-Wallet";
    const deliveryFeeFinal = deliveryMethod === "Delivery" ? deliveryFee : 0;
    const total = Math.max(subtotal + deliveryFeeFinal - currentDiscount, 0);

    const orderData = {
      cart: cartItems,
      deliveryMethod,
      paymentMethod,
      discount: currentDiscount,
      deliveryFee: deliveryFeeFinal,
      subtotal,
      total
    };

    const voucherCode = voucherInput.value.trim().toUpperCase();
    if (currentDiscount > 0 && voucherCode) {
      const userId = localStorage.getItem("userId") || "guest";
      const usedVouchersKey = `usedVouchers_${userId}`;
      const usedVouchers = JSON.parse(localStorage.getItem(usedVouchersKey)) || [];
      if (!usedVouchers.includes(voucherCode)) {
        usedVouchers.push(voucherCode);
        localStorage.setItem(usedVouchersKey, JSON.stringify(usedVouchers));
      }
    }

    console.log("✅ Order Placed:", orderData);
    alert(`Order placed successfully!\nTotal: ₱${total} (Discount: ₱${currentDiscount})`);
    localStorage.removeItem("checkoutCart");
    window.location.href = "index.html";
  });

  document.getElementById("backToMenuBtn").addEventListener("click", () => {
    window.location.href = "menu.html";
  });
});
