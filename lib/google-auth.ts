import { useEffect, useState } from 'react';

// Google API configuration
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface AuthState {
  isSignedIn: boolean;
  isInitialized: boolean;
  currentUser: GoogleUser | null;
  error: string | null;
}

// Load the Google API client library
export const loadGoogleApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (typeof window !== 'undefined' && window.gapi) {
      resolve();
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
          .then(() => {
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    };
    script.onerror = (error) => {
      reject(error);
    };

    // Add script to document
    document.body.appendChild(script);
  });
};

// Sign in with Google
export const signIn = async (): Promise<GoogleUser> => {
  try {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    const profile = googleUser.getBasicProfile();
    
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      photoUrl: profile.getImageUrl(),
    };
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

// Sign out from Google
export const signOut = async (): Promise<void> => {
  try {
    const googleAuth = window.gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
  } catch (error) {
    console.error('Error signing out from Google', error);
    throw error;
  }
};

// Check if user is signed in
export const isSignedIn = (): boolean => {
  if (typeof window === 'undefined' || !window.gapi || !window.gapi.auth2) {
    return false;
  }
  
  const googleAuth = window.gapi.auth2.getAuthInstance();
  return googleAuth.isSignedIn.get();
};

// Get current user
export const getCurrentUser = (): GoogleUser | null => {
  if (!isSignedIn()) {
    return null;
  }
  
  const googleAuth = window.gapi.auth2.getAuthInstance();
  const googleUser = googleAuth.currentUser.get();
  const profile = googleUser.getBasicProfile();
  
  return {
    id: profile.getId(),
    name: profile.getName(),
    email: profile.getEmail(),
    photoUrl: profile.getImageUrl(),
  };
};

// Custom hook for Google authentication
export const useGoogleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isSignedIn: false,
    isInitialized: false,
    currentUser: null,
    error: null,
  });

  useEffect(() => {
    const initializeGoogleAuth = async () => {
      try {
        await loadGoogleApi();
        
        const googleAuth = window.gapi.auth2.getAuthInstance();
        const isUserSignedIn = googleAuth.isSignedIn.get();
        
        setAuthState({
          isSignedIn: isUserSignedIn,
          isInitialized: true,
          currentUser: isUserSignedIn ? getCurrentUser() : null,
          error: null,
        });
        
        // Listen for sign-in state changes
        googleAuth.isSignedIn.listen((signedIn: boolean) => {
          setAuthState(prevState => ({
            ...prevState,
            isSignedIn: signedIn,
            currentUser: signedIn ? getCurrentUser() : null,
          }));
        });
      } catch (error) {
        console.error('Error initializing Google Auth', error);
        setAuthState(prevState => ({
          ...prevState,
          isInitialized: true,
          error: 'Failed to initialize Google authentication',
        }));
      }
    };

    initializeGoogleAuth();
  }, []);

  const handleSignIn = async () => {
    try {
      const user = await signIn();
      setAuthState(prevState => ({
        ...prevState,
        isSignedIn: true,
        currentUser: user,
        error: null,
      }));
      return user;
    } catch (error) {
      console.error('Error signing in', error);
      setAuthState(prevState => ({
        ...prevState,
        error: 'Failed to sign in with Google',
      }));
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuthState(prevState => ({
        ...prevState,
        isSignedIn: false,
        currentUser: null,
        error: null,
      }));
    } catch (error) {
      console.error('Error signing out', error);
      setAuthState(prevState => ({
        ...prevState,
        error: 'Failed to sign out',
      }));
      throw error;
    }
  };

  return {
    ...authState,
    signIn: handleSignIn,
    signOut: handleSignOut,
  };
};