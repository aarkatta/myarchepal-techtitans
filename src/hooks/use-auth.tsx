/**
 * Authentication Context and Hook
 * 
 * Provides global authentication state management throughout the application.
 * 
 * Features:
 * - Global user state accessible from any component
 * - Automatic loading of user from localStorage on mount
 * - User refresh functionality to sync state
 * - Logout functionality
 * 
 * Usage:
 * Wrap your app with <AuthProvider> and use useAuth() hook in components
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, getAuthState, signOut as authSignOut } from '@/lib/auth';

/**
 * Authentication context type definition
 */
interface AuthContextType {
  user: User | null;                    // Current authenticated user (null if not logged in)
  isAuthenticated: boolean;              // Whether user is currently authenticated
  isLoading: boolean;                    // Whether auth state is being loaded
  refreshUser: () => void;               // Function to refresh user from localStorage
  logout: () => void;                    // Function to sign out current user
}

// Create React context for authentication
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * 
 * Wraps the application and provides authentication state to all child components.
 * Automatically loads user from localStorage on mount.
 * 
 * @param children - Child components that need access to auth context
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State for current user
  const [user, setUser] = useState<User | null>(null);
  // State for authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Loading state (true while checking localStorage on mount)
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Refresh user state from localStorage
   * Useful after sign-in or profile updates
   */
  const refreshUser = () => {
    const authState = getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
  };

  /**
   * Log out current user
   * Clears auth state from localStorage and updates component state
   */
  const logout = () => {
    authSignOut();  // Remove from localStorage
    setUser(null);
    setIsAuthenticated(false);
  };

  // Load user from localStorage on component mount
  useEffect(() => {
    const authState = getAuthState();
    setUser(authState.user);
    setIsAuthenticated(authState.isAuthenticated);
    setIsLoading(false);  // Set loading to false after checking localStorage
  }, []);

  // Provide auth context to all children
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context
 * Must be used within an AuthProvider component
 * 
 * @returns AuthContextType - Authentication state and functions
 * @throws Error if used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

