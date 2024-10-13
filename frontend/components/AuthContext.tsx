import React, { useContext, createContext, PropsWithChildren, useState } from 'react';
import { useStorageState } from './useStorageState';
import {login} from "@/utils/authService";

// Define the User and AuthContextProps interfaces
interface User {
    id: string;
    role: string;
}

interface AuthContextProps {
    signIn: (email: string, password: string) => Promise<{ user: User; token: string }>;
    signOut: () => void;
    user: User | null; // User state added
    session: string | null;
    isLoading: boolean;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextProps>({
    signIn: async () => ({
        user: { id: '', role: '' }, // Return a dummy user object
        token: '', // Return an empty token or a default token
    }),
    signOut: () => {},
    user: null,
    session: null,
    isLoading: false,
});

// Hook to access the user info
export function useSession() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

// SessionProvider component
export function SessionProvider({ children }: PropsWithChildren<{}>) {
    const [user, setUser] = useState<User | null>(null); // User state initialized
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

// Ensure this is in your AuthContext

    const signIn = async (email: string, password: string): Promise<{ user: User; token: string }> => {
        setIsLoading(true);
        try {
            const { user: loggedInUser, token } = await login(email, password); // Call your login function
            setUser(loggedInUser); // Set user state
            setSession(token); // Save the token in state

            // Return user and token
            return { user: loggedInUser, token }; // Ensure this returns the user and token
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Rethrow error for handling in SignIn component
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = () => {
        setUser(null); // Reset user state on sign out
        setSession(null); // Reset session state
        // Handle sign-out logic (e.g., remove token from storage)
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, session, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
