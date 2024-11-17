import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, onSnapshot, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-OM0Riuj2Wr7md4Bu3hAuTMdrglMsn44",
  authDomain: "register-and-login-b2644.firebaseapp.com",
  projectId: "register-and-login-b2644",
  storageBucket: "register-and-login-b2644.appspot.com",
  messagingSenderId: "674830780279",
  appId: "1:674830780279:web:01eec023d5d6461c184372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Stripe
const stripe = Stripe("pk_test_your_public_key"); // Replace with your Stripe public key

// Retrieve user data from localStorage
const userData = JSON.parse(localStorage.getItem("userData"));

if (!userData) {
  window.location.href = "login.html";
} else {
  document.getElementById("user-name").textContent = userData.name;
  document.getElementById("user-email").textContent = userData.email;

  const cartRef = doc(db, "carts", userData.uid);

  // Real-time listener for the user's cart
  onSnapshot(cartRef, (docSnap) => {
    if (docSnap.exists()) {
      const cartItems = docSnap.data().products || [];
      const cartList = document.getElementById("cart-items");
      const totalItems = document.getElementById("total-items");
      const totalPrice = document.getElementById("total-price");

      cartList.innerHTML = ""; // Clear existing cart items

      let total = 0;

      if (cartItems.length > 0) {
        cartItems.forEach((item, index) => {
          total += item.price;
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.innerHTML = `
            ${item.name} - $${item.price}
            <button class="btn btn-danger btn-sm float-end" onclick="confirmRemove(${index})">Remove</button>
          `;
          cartList.appendChild(li);
        });
      } else {
        cartList.innerHTML = "<li class='list-group-item'>Your cart is empty.</li>";
      }

      totalItems.textContent = cartItems.length;
      totalPrice.textContent = total.toFixed(2);

      // Handle payment button
      document.getElementById("checkout-button").onclick = () => proceedToPayment(cartItems, total);
    } else {
      console.error("Cart document does not exist.");
    }
  });

  // Remove item with confirmation
  window.confirmRemove = function (index) {
    if (confirm("Are you sure you want to remove this item?")) {
      removeItem(index);
    }
  };

  // Remove item function
  async function removeItem(index) {
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const products = cartSnap.data().products;
      products.splice(index, 1); // Remove the selected item
      await updateDoc(cartRef, { products });
    }
  }

  // Function to proceed to payment
  async function proceedToPayment(cartItems, total) {
    try {
      const response = await fetch("https://your-backend-url/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems, total })
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  }

  // Logout function
  window.logout = async function () {
    await signOut(auth);
    localStorage.removeItem("userData");
    window.location.href = "login.html";
  };
}
