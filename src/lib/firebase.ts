// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa o Firebase de forma segura para ambientes de build
let app: FirebaseApp;

// Verifica se as chaves essenciais existem antes de inicializar
if (firebaseConfig.apiKey) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
} else {
    // Se não houver chaves, usamos um app placeholder no lado do servidor/build
    // para evitar que a aplicação quebre. O cliente ainda receberá as chaves via
    // variáveis de ambiente.
    if (!getApps().length) {
        // Apenas para evitar o erro "Firebase app is not initialized" no build.
        // As funcionalidades do Firebase não funcionarão no lado servidor sem as chaves.
        app = initializeApp({ projectId: "stub" });
    } else {
        app = getApp();
    }
}


const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
