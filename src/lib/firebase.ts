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

let app: FirebaseApp;

// Verifica se as chaves essenciais existem antes de inicializar
// Isso é crucial para o processo de build do Next.js (SSG) não quebrar
// quando as variáveis de ambiente não estão disponíveis no lado do servidor.
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
} else {
    // Se as chaves não estão disponíveis (ex: durante o build),
    // podemos retornar um app "stub" ou simplesmente não inicializar.
    // Para a maioria dos casos de uso onde o Firebase é client-side,
    // o código do cliente irá re-executar isso e obter o app correto.
    app = getApps().length > 0 ? getApp() : initializeApp({});
}


const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
