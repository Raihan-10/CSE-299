import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-OM0Riuj2Wr7md4Bu3hAuTMdrglMsn44",
    authDomain: "register-and-login-b2644.firebaseapp.com",
    databaseURL: "https://register-and-login-b2644-default-rtdb.firebaseio.com",
    projectId: "register-and-login-b2644",
    storageBucket: "register-and-login-b2644.appspot.com",
    messagingSenderId: "674830780279",
    appId: "1:674830780279:web:01eec023d5d6461c184372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Redirect to dashboard
function redirectToDashboard(user) {
    const userData = {
        name: user.displayName || "Anonymous",
        email: user.email,
        uid: user.uid
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    window.location.href = "userDashboard.html"; // Replace with your actual dashboard URL
}

// Register new user
window.signup = async function () {
    const email = document.getElementById('remail').value;
    const password = document.getElementById('rpassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Initialize user cart in Firestore
        await setDoc(doc(db, "carts", user.uid), { products: [] });
        alert("Registration successful!");
        redirectToDashboard(user);
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Signup error:", error);
    }
};

// Login existing user
window.login = async function () {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert("Login successful!");
        redirectToDashboard(user);
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Login error:", error);
    }
};

// Google Authentication
window.signInWithGoogle = async function () {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = userCredential.user;

        // Check if the user already has a cart, and create one if not
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);
        if (!cartSnap.exists()) {
            await setDoc(cartRef, { products: [] });
        }
        alert("Google Login successful!");
        redirectToDashboard(user);
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error("Google login error:", error);
    }
};
