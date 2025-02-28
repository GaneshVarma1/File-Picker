"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { isSignedInToGoogle } from './google-drive-api';
import { useToast } from '@/hooks/use-toast';

interface ConnectionContextType {
  connection: any;
  orgId: string | null;
  isLoading: boolean;
  error: string | null;
  refreshConnection: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [connection, setConnection] = useState<any>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const fetchConnection = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if signed in to Google
      const isGoogleSignedIn = isSignedInToGoogle();
      
      if (isGoogleSignedIn) {
        // Create a mock connection object for Google Drive
        setConnection({
          connection_id: 'google-drive-connection',
          name: 'Google Drive',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          connection_provider: 'gdrive'
        });
        
        setOrgId('google-drive-org');
      } else {
        toast({
          title: 'Google Drive Not Connected',
          description: 'Please sign in to your Google account to access your Drive files.',
          variant: 'default',
        });
        
        setConnection(null);
        setOrgId(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Google Drive';
      setError(errorMessage);
      
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      setConnection(null);
      setOrgId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchConnection();
    } else {
      setConnection(null);
      setOrgId(null);
    }
  }, [isAuthenticated, retryCount]);

  const refreshConnection = async () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <ConnectionContext.Provider value={{ connection, orgId, isLoading, error, refreshConnection }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}