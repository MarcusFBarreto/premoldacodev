// src/context/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export interface User extends FirebaseAuthUser {
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuário logado, busca a função (role) no Firestore
        const userDocRef = doc(db, 'equipe', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Adiciona o nome do usuário e a função ao objeto
          setUser({ ...firebaseUser, role: userData.funcao, displayName: userData.nome });
        } else {
          // Usuário autenticado mas sem registro na coleção 'equipe'
          setUser({ ...firebaseUser, role: 'sem-permissao' });
           await signOut(auth); // Desloga o usuário se ele não tem permissão
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // O listener do onAuthStateChanged vai cuidar de atualizar o estado do usuário
    } catch (e: any) {
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('Email ou senha inválidos. Verifique e tente novamente.');
      } else {
        setError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
      }
      console.error(e);
      setLoading(false); // Garante que o loading pare em caso de erro
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = { user, loading, error, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
