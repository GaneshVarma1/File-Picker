"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useFileStore } from "./store";
import { useToast } from "@/hooks/useToast";

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const resetFileStore = useFileStore((state) => state.resetState);
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser =
      typeof window !== "undefined"
        ? localStorage.getItem("google_user")
        : null;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          error: null,
          user,
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("google_user");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate Google sign-in
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create mock user data
      const mockUser = {
        id: "google-user-123",
        name: "Google User",
        email: "user@gmail.com",
        imageUrl: "https://lh3.googleusercontent.com/a/default-user",
      };

      // Store user info in localStorage
      localStorage.setItem("google_user", JSON.stringify(mockUser));

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        user: mockUser,
      });

      toast({
        title: "Success",
        description: "Signed in to Google Drive successfully",
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
        user: null,
      });
      return Promise.reject(error);
    }
  };

  const logout = () => {
    // Clear stored user data
    if (typeof window !== "undefined") {
      localStorage.removeItem("google_user");
    }

    // Reset file store state when logging out
    resetFileStore();

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
    });

    toast({
      title: "Signed out",
      description: "You have been signed out of Google Drive",
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
