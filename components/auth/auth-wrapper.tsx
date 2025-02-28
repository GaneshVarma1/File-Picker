"use client";

import { useAuth } from '@/lib/auth-context';
import { GoogleSignInButton } from './google-sign-in-button';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-gray-50">
        <GoogleSignInButton />
      </div>
    );
  }

  return <>{children}</>;
}