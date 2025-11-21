import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// IMPORTANT: Please replace the placeholder values below with the actual values from your
// Firebase project settings to connect to the correct backend.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // <-- Replace with your new API Key
  authDomain: "finance-manager-31736709-3b243.firebaseapp.com",
  projectId: "finance-manager-31736709-3b243",
  storageBucket: "finance-manager-31736709-3b243.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // <-- Replace with your new Sender ID
  appId: "YOUR_APP_ID", // <-- Replace with your new App ID
  measurementId: "YOUR_MEASUREMENT_ID" // <-- Optional, replace if you use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
