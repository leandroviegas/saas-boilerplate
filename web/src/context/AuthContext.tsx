'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { User as BetterUser, Session } from "better-auth/client"
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { parseStaticUrl } from '@/utils/staticManager';
import { useWebsockets, WsData, wsTypeEnum } from '@/hooks/useWebsockets';
import socket from '@/utils/client/socket';

export enum rolesEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MEMBER = 'MEMBER',
  ANON = 'ANON'
}

export interface User extends BetterUser {
  username?: string;
  preferences?: string;
  twoFactorEnabled?: boolean;
  roleSlug?: rolesEnum;
}

interface SignInData {
  email: string
  password: string
}

interface SignUpData {
  email: string
  password: string
  name: string
  username: string
}

interface AuthContextType {
  user?: User
  session?: Session
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  updateSession: () => Promise<void>
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode,
  user?: User,
  session?: Session
}

const parseUser = (user?: BetterUser) => {
  if (!user) return user;
  return { ...user, image: parseStaticUrl(user.image) };
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, user: u, session: s }) => {
  const [user, setUser] = useState<BetterUser | undefined>(parseUser(u));
  const [session, setSession] = useState<Session | undefined>(s);
  const router = useRouter();

  useEffect(() => {
    updateSession()
  }, [])

  useWebsockets('auth', (data: WsData) => {
    if (data.type == wsTypeEnum.SESSION_REVOKED) router.push('/auth');
  }, !!user);

  const updateSession = async () => {
    const { data } = await authClient.getSession();
    if (!data) return;
    setUser(parseUser(data.user));
    setSession(data.session);
  }

  const signIn = async (form: SignInData) => {
    const { data, error } = await authClient.signIn.email(form);

    if (error) {
      throw new Error(error.message);
    }

    setUser(parseUser(data.user));
    await updateSession();
    socket.disconnect();
    socket.connect();
    router.push('/dashboard');
  }

  const signUp = async (form: SignUpData) => {
    const { data, error } = await authClient.signUp.email(form);

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      await signIn(form);
    }
  }

  const signOut = async () => {
    await authClient.signOut();
    router.push('/auth');
  }

  return <AuthContext.Provider value={{
    user,
    session,
    signIn,
    signUp,
    signOut,
    updateSession
  }}>{children}</AuthContext.Provider>
}