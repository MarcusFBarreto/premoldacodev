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

// Inicializa o Firebase de forma segura, garantindo que não quebre no build
let app: FirebaseApp;

if (!getApps().length) {
    // Só inicializa se as chaves estiverem presentes
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
        app = initializeApp(firebaseConfig);
    } else {
        // Durante o build no servidor sem chaves, não podemos inicializar.
        // Criamos um objeto "dummy" para evitar que o código quebre.
        // A lógica do lado do cliente fará a inicialização correta.
        app = {} as FirebaseApp;
    }
} else {
    app = getApp();
}

const auth = getApps().length > 0 ? getAuth(app) : ({} as any);
const db = getApps().length > 0 ? getFirestore(app) : ({} as any);

export { app, auth, db };
