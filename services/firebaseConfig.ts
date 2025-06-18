// services/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA28B4RphI8x4-Mpt-W5jyIKb3EIRe9EEo",
  authDomain: "bambe-app.firebaseapp.com",
  databaseURL: "https://bambe-app-default-rtdb.firebaseio.com",
  projectId: "bambe-app",
  storageBucket: "bambe-app.appspot.com",
  messagingSenderId: "680111632960",
  appId: "1:680111632960:web:5a9ff0b941a72d8019a5a5"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Database
export const auth = getAuth(app);
export const db   = getDatabase(app);
