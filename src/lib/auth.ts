/**
 * Authentication utilities for managing user authentication and storage
 * 
 * This module handles:
 * - User registration (sign up)
 * - User authentication (sign in)
 * - User profile management
 * - LocalStorage-based persistence
 * 
 * NOTE: This is a demo implementation using localStorage.
 * In production, you should use proper password hashing (bcrypt) and
 * a secure backend API for authentication.
 */

/**
 * User interface representing a registered user in the system
 */
export interface User {
  id: string;                    // Unique user identifier
  username: string;              // Unique username for login
  email: string;                 // User's email address
  phone: string;                 // User's phone number
  address: string;               // User's street address
  city: string;                  // User's city
  state: string;                 // User's state/province
  country: string;                // User's country
  label: string;                 // User's profession label (e.g., "I'm an archaeologist")
  name?: string;                 // User's full name (optional, can be added in profile)
  title?: string;                // User's job title (optional)
  location?: string;             // User's current location (optional)
  avatar?: string;               // URL to user's profile avatar (optional)
  password?: string;             // User's password (stored for demo - NOT RECOMMENDED FOR PRODUCTION)
  createdAt: string;            // ISO timestamp of when account was created
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;             // Current authenticated user (null if not logged in)
  isAuthenticated: boolean;       // Whether user is currently authenticated
}

// LocalStorage keys for persistence
const STORAGE_KEY = 'archepal_auth';    // Key for storing current auth state
const USERS_KEY = 'archepal_users';     // Key for storing all registered users

/**
 * Get the currently authenticated user from localStorage
 * @returns The current user object or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return null;
  
  // Retrieve auth state from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  try {
    const authState: AuthState = JSON.parse(stored);
    return authState.user;
  } catch {
    // If parsing fails, return null
    return null;
  }
};

/**
 * Get all registered users from localStorage
 * @returns Array of all registered users
 */
export const getAllUsers = (): User[] => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return [];
  
  // Retrieve users list from localStorage
  const stored = localStorage.getItem(USERS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    // If parsing fails, return empty array
    return [];
  }
};

/**
 * Save a user to the users list in localStorage
 * If user already exists (by id, email, or username), update it
 * @param user - The user object to save
 */
export const saveUser = (user: User): void => {
  const users = getAllUsers();
  
  // Check if user already exists (by id, email, or username)
  const existingIndex = users.findIndex(
    u => u.id === user.id || u.email === user.email || u.username === user.username
  );
  
  if (existingIndex >= 0) {
    // Update existing user
    users[existingIndex] = user;
  } else {
    // Add new user
    users.push(user);
  }
  
  // Save updated users list to localStorage
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/**
 * Sign up a new user
 * Validates that username and email are unique before creating account
 * @param userData - User data excluding id and createdAt (these are auto-generated)
 * @returns The newly created user object (without password for security)
 * @throws Error if username or email already exists
 */
export const signUp = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getAllUsers();
  
  // Validate that username is unique
  if (users.some(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  // Validate that email is unique
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  // Create new user object with auto-generated id and timestamp
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  // Save user to localStorage
  saveUser(newUser);
  
  // Remove password from returned user object for security
  // Password is stored in localStorage but never returned to the client
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
};

/**
 * Sign in an existing user
 * Validates username/email and password
 * @param usernameOrEmail - Username or email address for login
 * @param password - User's password
 * @returns The authenticated user object (without password)
 * @throws Error if user not found or password is incorrect
 */
export const signIn = (usernameOrEmail: string, password: string): User => {
  const users = getAllUsers();
  
  // Find user by username or email
  const user = users.find(
    u => (u.username === usernameOrEmail || u.email === usernameOrEmail)
  );
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // NOTE: In production, you should use bcrypt or similar to hash and verify passwords
  // This is a demo implementation doing plain text comparison (NOT SECURE FOR PRODUCTION)
  if (user.password !== password) {
    throw new Error('Invalid password');
  }
  
  // Remove password from user object before storing in auth state (for security)
  const { password: _, ...userWithoutPassword } = user;
  
  // Set authentication state in localStorage
  setAuthState({ user: userWithoutPassword as User, isAuthenticated: true });
  
  return userWithoutPassword as User;
};

/**
 * Set the authentication state in localStorage
 * @param authState - The authentication state to save
 */
export const setAuthState = (authState: AuthState): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Save auth state to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
};

/**
 * Get the current authentication state from localStorage
 * @returns The current authentication state
 */
export const getAuthState = (): AuthState => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }
  
  // Retrieve auth state from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { user: null, isAuthenticated: false };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    // If parsing fails, return default state
    return { user: null, isAuthenticated: false };
  }
};

/**
 * Sign out the current user
 * Removes authentication state from localStorage
 */
export const signOut = (): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Remove auth state from localStorage
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Update a user's profile information
 * Does not allow updating password through this function
 * @param userId - The ID of the user to update
 * @param updates - Partial user object with fields to update
 * @returns The updated user object (without password)
 * @throws Error if user not found
 */
export const updateUserProfile = (userId: string, updates: Partial<User>): User => {
  const users = getAllUsers();
  
  // Find user by ID
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Remove password from updates (password changes should be handled separately)
  const { password: _, ...safeUpdates } = updates;
  
  // Merge updates with existing user data
  const updatedUser = { ...users[userIndex], ...safeUpdates };
  
  // Save updated user to localStorage
  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Remove password from user object before storing in auth state (for security)
  const { password: __, ...userWithoutPassword } = updatedUser;
  
  // Update current auth state if this is the logged-in user
  const authState = getAuthState();
  if (authState.user?.id === userId) {
    setAuthState({ user: userWithoutPassword as User, isAuthenticated: true });
  }
  
  return userWithoutPassword as User;
};

