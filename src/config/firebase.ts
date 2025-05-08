// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Reemplaza esta configuración con la que obtuviste de Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyASw2HJGxuYMZqLM_BpgSGxbH13TlV_luE",
    authDomain: "annuar-49c99.firebaseapp.com",
    projectId: "annuar-49c99",
    storageBucket: "annuar-49c99.firebasestorage.app",
    messagingSenderId: "1076867132197",
    appId: "1:1076867132197:web:3ea4db31d533a91277c8cc",
    measurementId: "G-HFBSR5BWB0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportar el servicio de autenticación
export const auth = getAuth(app);
export default app;