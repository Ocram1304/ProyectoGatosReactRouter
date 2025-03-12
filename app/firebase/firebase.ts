// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Para Firestore (base de datos)
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaI6eduPet_KCzOb7T7E3keN6sHovhCMI",
  authDomain: "proyectogastos-e7b16.firebaseapp.com",
  projectId: "proyectogastos-e7b16",
  storageBucket: "proyectogastos-e7b16.firebasestorage.app",
  messagingSenderId: "473336468759",
  appId: "1:473336468759:web:9630f68ec1b3f5d8d15352",
  measurementId: "G-VPGGLDQHXX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Inicializa Firestore (base de datos)
const db = getFirestore(app);
// Exporta la instancia de Firestore para usarla en otros archivos
export { db };